import type { Role } from "@prisma/client";

export interface CreateUserInput {
  email: string;
  password: string; // plain for now; service will hash later
  firstName?: string;
  lastName?: string;
  role?: Role;
}
