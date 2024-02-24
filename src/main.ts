import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SWAGGER_DESCRIPTION } from './common/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
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
  await app.listen(configService.getOrThrow('API_PORT'));
}
bootstrap();
