import { Module } from '@nestjs/common';
import { B24Service } from './b24.service';

@Module({
  controllers: [],
  providers: [B24Service],
  exports: [B24Service]
})
export class B24Module {}
