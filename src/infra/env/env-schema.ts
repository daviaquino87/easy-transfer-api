import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('test'),
  PORT: z.coerce.number().optional().default(3001),

  DATABASE_URL: z.string(),
  LOG_DATABASE: z.string().optional().default('false'),

  JWT_AUTH_SECRET: z.string().min(10),

  BANK_AUTHORIZATION_URL: z.string(),

  RABBITMQ_URL: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
