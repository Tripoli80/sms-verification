// Створити RESTful API для управління продуктами із моделлю з такими полями: назва, опис, ціна, категорія
import { CreateClientDto } from './client.dto';
import { IFindListOrder, IResponse } from 'src/base/interfaces';
import { Client } from './client.schema';

export enum Category {
  FOOD = 'food',
  CLOTHES = 'clothes',
  ELECTRONICS = 'electronics',
  CLIENT = 'Client',
  OTHER = 'other',
}
// export class Client {
//   @PrimaryGeneratedColumn()
//   @ApiProperty()
//   id: number;

//   @Column()
//   @ApiProperty()
//   name: string;

//   @Column()
//   @ApiProperty()
//   phone: string;

//   @Column({ default: false })
//   @ApiProperty()
//   confirmed: boolean;

//   @Column()
//   @ApiProperty()
//   deal: boolean;

//   @Column()
//   @ApiProperty()
//   code: string;

//   @Column()
//   @ApiProperty()
//   countsms: string;
// }

export interface IClient {
  id?: string;
  name: string;
  phone: string;
  confirmed: boolean;
  deal: boolean;

  code: string;
  countsms: string;
  domen: string;
}

export interface IClientServiceInterface {
  handler(userDto: CreateClientDto): Promise<IResponse<Client>>;
  findAll(option: IFindListOrder): Promise<IResponse<Client[]>>;
  findOne(id: number): Promise<IResponse<Client>>;
  update(id: number, clientDto: CreateClientDto): Promise<IResponse<Client>>;
  remove(id: number): Promise<IResponse<Client>>;
}
