import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './client.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { B24Service } from 'src/b24/b24.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientController],
  providers: [ClientService, B24Service],
  exports: [ClientService],
})
export class ClientModule {}
