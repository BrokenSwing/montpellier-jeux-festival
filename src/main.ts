import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Festival } from './festival/entities/festival.entity';
import { Repository } from 'typeorm';
import { TableQuantities } from './booking/entities/table-quantities.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      skipMissingProperties: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Montpellier Game Festival')
    .setDescription(
      'This document explain how to use the REST API of the Montpellier Game Festival',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey, methodKey) => {
      const controllerId = controllerKey.endsWith('Controller')
        ? controllerKey.substring(0, controllerKey.length - 'Controller'.length)
        : controllerKey;
      return `${controllerId}->${methodKey}`;
    },
  });
  SwaggerModule.setup('api', app, document);

  await app.get(UserService).createDefaultUserIfRequired();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
