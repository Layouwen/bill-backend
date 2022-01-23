import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enable();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('蓝鲸记账api文档')
    .setDescription('技术团队：梁又文、梁金俊')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Token',
    )
    .build();
  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: '蓝鲸记账api文档',
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('doc', app, document, customOptions);
  await app.listen(3000);
}

void bootstrap();
