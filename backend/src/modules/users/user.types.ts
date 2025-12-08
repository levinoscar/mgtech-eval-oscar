// src/modules/users/user.types.ts
import type { Role } from "@prisma/client";

export interface CreateUserInput {
  email: string;
  password: string; // plain for now; service/auth layer hashes it
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface ListUsersParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedUsersResult {
  items: Array<{
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search?: string;
}
