import { prisma } from "../../db/prismaClient";
import type { CreateUserInput } from "./user.types";

export const userRepo = {
  findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: CreateUserInput & { passwordHash: string }) {
    const { password, ...rest } = data as any; // ensure plain password isn't persisted accidentally
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });
  },
};
