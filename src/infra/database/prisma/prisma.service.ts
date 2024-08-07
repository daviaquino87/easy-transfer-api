import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(envService: EnvService) {
    const LOG_DATABASE = envService.get('LOG_DATABASE');

    super({
      log: LOG_DATABASE === 'true' ? ['query'] : [],
    });
  }

  private applySoftDeleteMethods(prismaClient: any) {
    return {
      findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },

      findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },

      findUnique({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },

      delete({ args, model }) {
        return prismaClient[model].update({
          ...args,
          data: { deletedAt: new Date() },
        });
      },

      deleteMany({ args, model }) {
        return prismaClient[model].updateMany({
          ...args,
          data: { deletedAt: new Date() },
        });
      },
    };
  }

  private async enableExtensions(prismaClient: PrismaClient) {
    return this.$extends({
      query: {
        user: this.applySoftDeleteMethods(prismaClient),
        bankAccount: this.applySoftDeleteMethods(prismaClient),
      },
    });
  }

  async onModuleInit() {
    await this.$connect();

    Object.assign(this, await this.enableExtensions(this));
  }
}
