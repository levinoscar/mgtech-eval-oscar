// src/common/password.ts
// Single source of truth for password hashing, shared by the auth/user
// services and the seed scripts so they all hash identically.
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (
  plain: string,
  hash: string
): Promise<boolean> => bcrypt.compare(plain, hash);
