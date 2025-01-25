import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config as dotenvConfig } from 'dotenv';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenvConfig({
  path: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api/v1', { exclude: [''] });

  //ConfigCors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  //ConfigSwagger
  const config = new DocumentBuilder()
    .setTitle('PregnaCare')
    .setDescription('API documentation for PregnaCare application')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);

  await app.listen(port ?? 8080);
}
bootstrap();
