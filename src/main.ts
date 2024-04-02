import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SWAGGER_DESCRIPTION } from './common/constants';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AdminCRMback')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/swagger-json',
    customSiteTitle: 'AdminCRMback',
  });

  const server = await app.listen(configService.getOrThrow('API_PORT'));
  const address = server.address();
  if (typeof address !== 'string') {
    logger.log(`The server is running at the address: http://localhost:${address.port}`);
    logger.log(`Swagger description: http://localhost:${address.port}/swagger`);
  } else {
    logger.log(`The server is running at the address: http://localhost:${address}`);
    logger.log(`Swagger description: http://localhost:${address}/swagger`);
  }
}
bootstrap();
