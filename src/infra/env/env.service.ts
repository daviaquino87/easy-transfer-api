import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvSchema } from '@/infra/env/env-schema';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvSchema, true>) {}

  get<T extends keyof EnvSchema>(key: T): EnvSchema[T] {
    return this.configService.get(key);
  }
}
