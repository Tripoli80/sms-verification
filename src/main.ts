/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      // 'http://localhost:8000',
      'https://dev.mrouter.com.ua',
      'https://mrouter.com.ua',
      'https://mobua.com.ua',
    ], // разрешаем доступ только с этого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // разрешенные методы
    credentials: true, // разрешаем отправлять и принимать куки на кросс-доменных запросах
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const PORT = process.env.PORT || 3001;
  const apiUrl = !process.env?.npm_lifecycle_script.includes('--watch')
    ? process.env?.PROD_API_URL
      ? `${process.env.PROD_API_URL}:${PORT}`
      : `http://localhost:${PORT}`
    : process.env?.DEV_API_URL
      ? `${process.env.DEV_API_URL}:${PORT}`
      : `http://localhost:${PORT}`;

  const config = new DocumentBuilder()
    .setTitle('Client project')
    .setDescription(
      'API for work with "Client". \n\n`Sometime in update (reboting process)`',
    )
    .addServer(apiUrl)
    .addBearerAuth(
      {
        type: 'http',
        name: 'authorization',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .setVersion('0.1')
    .addTag('Client')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
