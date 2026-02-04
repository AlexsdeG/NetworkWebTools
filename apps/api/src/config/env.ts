import dotenv from 'dotenv';
import { z } from 'zod';
import process from 'process';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Auth keys - required for security
  JWT_SECRET: z.string().min(10, "JWT_SECRET muss mindestens 10 Zeichen lang sein"),
  ADMIN_PASS_HASH: z.string().min(10, "ADMIN_PASS_HASH ist erforderlich")
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Ungültige Umgebungsvariablen:', envParsed.error.format());
  process.exit(1);
}

export const env = envParsed.data;