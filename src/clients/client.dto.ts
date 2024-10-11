import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from './client.schema';

export class CreateClientDto implements Partial<Client> {
  @ApiProperty()
  @IsString()
  domen: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alfa: string;

  @ApiProperty({ example: 'Ethan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Phone' })
  // @IsPhoneNumber()
  @IsString()
  phone: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  confirmed: false;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  deal: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  countsms: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  product: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionsrt: string;
}

export class UpdateClientDto implements Partial<Client> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  domen: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alfa: string;

  @ApiProperty({ example: 'Pizza' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pizza description' })
  // @IsPhoneNumber()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  deal: string;

  @IsString()
  @IsOptional()
  product: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  actionsrt: string;
}

export class ConfirmSmsDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  domen: string;

  @ApiProperty({ example: 'Pizza description' })
  // @IsPhoneNumber()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionsrt: string;


  // []
  // else string properties
  [key: string]: string;
}
