import { Module } from '@nestjs/common';
import { ClientModule } from './clients/client.module';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
// import { B24Module } from './b24/b24.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database:  process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // DatabaseModule,
    ClientModule,

    // B24Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
