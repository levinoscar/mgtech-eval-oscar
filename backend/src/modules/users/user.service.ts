import type { CreateUserInput } from "./user.types";
import { userRepo } from "./user.repo";

export const userService = {
  async listUsers() {
    return userRepo.findAll();
  },

  async createUser(input: CreateUserInput) {
    // NOTE: this is where we’ll plug in proper hashing later
    const passwordHash = `hash:${input.password}`;

    const existing = await userRepo.findByEmail(input.email);
    if (existing) {
      const error: any = new Error("Email already in use");
      error.status = 409;
      error.code = "EMAIL_TAKEN";
      throw error;
    }

    return userRepo.create({
      ...input,
      passwordHash,
    });
  },
};
