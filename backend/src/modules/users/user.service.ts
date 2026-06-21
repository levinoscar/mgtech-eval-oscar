// src/modules/users/user.service.ts
import { userRepo } from "./user.repo";
import { hashPassword } from "../../common/password";
import type { ListUsersParams, PaginatedUsersResult } from "./user.types";
import type { CreateUserBody } from "./user.validation";

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

  async createUser(input: CreateUserBody) {
    const existing = await userRepo.findByEmail(input.email);
    if (existing) {
      const error: any = new Error("Email already in use");
      error.status = 409;
      error.code = "EMAIL_TAKEN";
      throw error;
    }

    // Never store the raw password — hash it first.
    const passwordHash = await hashPassword(input.password);

    return userRepo.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      // role is not settable via this public endpoint -> Prisma applies USER.
    });
  },
};
