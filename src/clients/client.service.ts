import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfirmSmsDTO, CreateClientDto, UpdateClientDto } from './client.dto';
import { Client } from './client.schema';
import { IClientServiceInterface } from './client.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { B24Service } from 'src/b24/b24.service';
import { sms } from 'src/utils/sms';

@Injectable()
export class ClientService implements IClientServiceInterface {
  constructor(
    @InjectRepository(Client)
    private readonly clientRep: Repository<Client>,
    private readonly b24: B24Service,
  ) {}
  async isExist(id: number): Promise<Client | null> {
    const client = await this.clientRep.findOneBy({ id });
    if (!client)
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    return client;
  }
  async isExistByPhone(phone: string, domen: string): Promise<Client | null> {
    const client = await this.clientRep.findBy({ phone, domen });
    return client[client.length - 1];
  }

  async handler(createClientDto: CreateClientDto) {
    let client = await this.isExistByPhone(
      createClientDto.phone,
      createClientDto.domen,
    );
    if (client && client?.deal && client?.isOpen) {
      return {
        success: !!client,
        data: client,
      };
    }
    if (client && client?.deal && !client?.isOpen) {
      // client = this.clientRep.create(createClientDto);
      const contact = await this.b24.getContactById(client.contact);
      if (!contact?.ID) {
        client.contact = (
          await this.b24.createContact(client.name, client.phone, client.domen)
        ).toString();
      }
      client.confirmed = true;
      client.isOpen = true;

      const tittle = `Заказ(повторный) от ${client.name} [${client.domen}]`;
      const comment = `Заказ на сумму ${client.amount}. С сайта ${client.domen}`;
      client.deal = (
        await this.b24.createDeal(
          tittle,
          +client.contact,
          client.amount,
          comment,
        )
      ).toString();
      await this.clientRep.save(client);
      if (client?.code) delete client.code;
      return {
        success: !!client,
        data: client,
      };
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    if (client && !client?.deal && !client?.isOpen) {
      if (client?.countsms >= 3) {
        throw new HttpException('Too many sms', HttpStatus.TOO_MANY_REQUESTS);
      }
      client.countsms = client.countsms + 1;
      client.code = code.toString();
    } else {
      client = this.clientRep.create(createClientDto);
      client.countsms = 1;
      client.code = code.toString();
      client.confirmed = false;
      client.countTryConfirm = 0;
      client.isOpen = false;
      client.deal = '';
    }
    await sms(`${code}`, client.phone);


    await this.clientRep.save(client);
    if (client?.code) delete client.code;
    return {
      success: !!client,
      data: client,
    };
  }

  async confirmSMS({ phone, domen, code }: ConfirmSmsDTO) {
    const client = await this.isExistByPhone(phone, domen);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
    if (client.confirmed) {
      throw new HttpException(
        'Client alredy confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }
    client.countTryConfirm = client.countTryConfirm + 1;
    if (client.countTryConfirm > 30) {
      throw new HttpException(
        'Too many try confirm',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (client.code && code === client.code) {
      client.confirmed = true;
      client.isOpen = true;
      const contact = await this.b24.findByPhone(phone);
      if (contact?.length) {
        client.contact = contact[0].ID;
      } else {
        client.contact = (
          await this.b24.createContact(client.name, client.phone, client.domen)
        ).toString();
      }
      const tittle = `Заказ от ${client.name} [${domen}]`;
      const comment = `Заказ на сумму ${client.amount}. С сайта ${client.domen}`;
      client.deal = (
        await this.b24.createDeal(
          tittle,
          +client.contact,
          client.amount,
          comment,
        )
      ).toString();
    }
    await this.clientRep.save(client);
    return {
      success: client.confirmed,
      data: client,
    };
  }

  async findAll() {
    // const { limit, offset, orderType } = option;
    const clients = await this.clientRep.find();

    return {
      success: !!clients,
      data: clients,
      total: clients.length,
    };
  }

  async findOne(id: number) {
    const client = await this.clientRep.findOneBy({ id });
    return {
      success: !!client,
      data: client,
    };
  }

  async findAndClose(deal: string) {
    const client = await this.clientRep.findOneBy({ deal });
    client.isOpen = false;
    await this.clientRep.save(client);
    return {
      success: !!client,
      data: client,
    };
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.isExist(id);
    const res = await this.clientRep.update(id, updateClientDto);
    return {
      success: !!res,
      data: !!res ? { ...client, ...updateClientDto } : null,
    };
  }

  async remove(id: number) {
    const client = await this.isExist(id);
    const res = await this.clientRep.delete({ id });

    return {
      success: !!res,
      data: client,
    };
  }
}
