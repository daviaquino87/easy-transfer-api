import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConsumersModule } from '@/main/consumers/consumers.module';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const instanceId = randomUUID();

  Logger.log(`Start consumers application - ${instanceId}`);

  process.argv.push('--registerHandlers');

  const app = await NestFactory.createApplicationContext(ConsumersModule);

  await app.init();
}

bootstrap();
