// src/config/env.ts
import { config as loadEnv } from "dotenv";
import { z } from "zod";

const isTest = process.env.NODE_ENV === "test";
const envFile = isTest ? ".env.test" : ".env";

// In test, we *want* .env.test to override anything else (including .env)
loadEnv({ path: envFile, override: isTest });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10, "JWT_SECRET should be at least 10 chars"),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
