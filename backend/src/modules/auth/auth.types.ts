// src/modules/auth/auth.types.ts
import type { Role } from "@prisma/client";

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
