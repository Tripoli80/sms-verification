import { Injectable } from '@nestjs/common';
import { Bitrix, Contact } from '@2bad/bitrix';

const bitrix = Bitrix('https://perpetum.kz/rest/5/c4gqwx0ga47cqg6d/');
@Injectable()
export class B24Service {
  async findByPhone(phone: string): Promise<Contact[]> {
    const contacts = await bitrix.contacts.list({
      filter: { PHONE: phone },
      select: ['ID', 'NAME', 'LAST_NAME'],
    });
    return [...contacts.result];
  }

  async getContactById(id: string): Promise<Contact> {
    try {
      const result = await this.contactIsExist(+id);
      return result;
    } catch (error) {
      return null;
    }
  }

  async contactIsExist(id: number) {
    try {
      const { result } = await bitrix.contacts.get(`${id}`);
      if (!result.ID) throw new Error('Contact not  exist');
      return result;
    } catch (error) {
      throw new Error('Contact not created');
    }
  }

  async createContact(
    name: string,
    phone: string,
    domen?: string,
  ): Promise<number> {
    const payload = {
      NAME: name,
      PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: domen ? domen : '',
    };
    const { result } = await bitrix.contacts.create(payload);
    return result;
  }

  async getDeal(id: number) {
    const { result } = await bitrix.deals.get(`${id}`);
    if (!result.ID) throw new Error('Deal not created');
    return result;
  }

  async createDeal(
    tittle: string,
    contactId: number,
    price: number,
    comment: string,
  ): Promise<number> {
    await this.contactIsExist(contactId);
    const payload = {
      CONTACT_ID: `${contactId}`,
      TITLE: tittle,
      PRICE: `${price ? price : 0}`,
      CURRENCY_ID: 'UAH',
      OPPORTUNITY: `${price ? price : 0}`,
      COMMENTS: comment ? comment : '',
    };
    const { result } = await bitrix.deals.create(payload);
    return result;
  }
}
