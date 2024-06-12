import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  domen: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  phone: string;

  @Column({ default: false })
  @ApiProperty()
  confirmed: boolean;

  @Column()
  @ApiProperty()
  deal: string;

  @Column()
  @ApiProperty()
  contact: string;

  @Column()
  @ApiProperty()
  isOpen: boolean;

  @Column()
  @ApiProperty()
  code: string;

  @Column()
  @ApiProperty()
  countsms: number;

  @Column()
  @ApiProperty()
  countTryConfirm: number;

  @Column()
  @ApiProperty()
  amount: number;

  @Column( { type: String, default:"" })
  @ApiProperty()
  product: string;

  @CreateDateColumn()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
