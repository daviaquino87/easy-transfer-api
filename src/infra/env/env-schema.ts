import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('test'),
  PORT: z.coerce.number().optional().default(3001),
  DATABASE_URL: z.string(),
  JWT_AUTH_SECRET: z.string().min(10),
  LOG_DATABASE: z.string().optional().default('false'),
  BANK_AUTHORIZATION_URL: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
