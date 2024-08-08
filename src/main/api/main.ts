import { NestFactory } from '@nestjs/core';
import { HttpModule } from '@/main/api/http.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as cookieParser from 'cookie-parser';

import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { EnvService } from '@/infra/env/env.service';
import { HttpExceptionFilter } from '@/main/api/exception.filter';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

const packageJson = readFileSync('package.json', 'utf-8');
const { version, name, description } = JSON.parse(packageJson);

function enableDocs(app: NestExpressApplication) {
  const formatName = name?.toUpperCase()?.replace('-', ' ');

  const config = new DocumentBuilder()
    .setTitle(formatName)
    .setDescription(description)
    .setVersion('')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: `${formatName} ${version}`,
  };
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, customOptions);
}

function enableCors(app: NestExpressApplication) {
  app.enableCors();
}

function enableExceptionFilter(app: NestExpressApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}

function secureApp(app: NestExpressApplication) {
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use((_req: Request, res: Response, next) => {
    res.header('Server', 'Easy Transfer API');
    next();
  });

  app.set('trust proxy', 1);
}

function enableCookieParser(app: NestExpressApplication) {
  app.use(cookieParser());
}

async function runServer(app: NestExpressApplication, port: number) {
  await app.listen(port);
}

async function bootstrap() {
  const instanceId = randomUUID();

  Logger.log(`Start api application: ${name}:${version} - ${instanceId}`);

  const app = await NestFactory.create<NestExpressApplication>(HttpModule);

  const env = app.get(EnvService);
  const PORT = env.get('PORT');
  const NODE_ENV = env.get('NODE_ENV');

  if (NODE_ENV === 'development' || NODE_ENV === 'test') {
    enableDocs(app);
  }

  secureApp(app);
  enableExceptionFilter(app);
  enableCors(app);
  enableCookieParser(app);
  runServer(app, PORT);
}
bootstrap();
