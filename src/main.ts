import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import config from './config';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // app.enable();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  app.use(
    session({
      secret: config.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  const docConfig = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, docConfig, options);
  SwaggerModule.setup('doc', app, document, customOptions);
  await app.listen(3001);
}

void bootstrap();
