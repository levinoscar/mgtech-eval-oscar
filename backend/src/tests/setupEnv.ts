// src/tests/setupEnv.ts
import { config as loadEnv } from "dotenv";
import path from "path";

// Make sure NODE_ENV is set (package.json script should already set NODE_ENV=test)
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

const isTest = process.env.NODE_ENV === "test";

const envPath = isTest
  ? path.resolve(__dirname, "../../.env.test")
  : path.resolve(__dirname, "../../.env");

loadEnv({ path: envPath, override: true });
