// src/modules/users/user.service.ts
import { userRepo } from "./user.repo";
import type { CreateUserInput, ListUsersParams, PaginatedUsersResult } from "./user.types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const userService = {
  async listUsers(params: Partial<ListUsersParams> = {}): Promise<PaginatedUsersResult> {
    let page = params.page ?? DEFAULT_PAGE;
    let pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 1;
    if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

    const search = params.search?.trim() || undefined;

    const result = await userRepo.findPaginated({
      page,
      pageSize,
      search,
    });

    return result;
  },

  // likely used internally for seeding / admin creation paths
  async createUser(input: CreateUserInput & { passwordHash: string }) {
    const existing = await userRepo.findByEmail(input.email);
    if (existing) {
      const error: any = new Error("Email already in use");
      error.status = 409;
      error.code = "EMAIL_TAKEN";
      throw error;
    }

    return userRepo.create(input);
  },
};
