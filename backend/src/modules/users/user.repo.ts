// src/modules/users/user.repo.ts
import { prisma } from "../../db/prismaClient";
import type { ListUsersParams } from "./user.types";
import { Prisma, type Role } from "@prisma/client";

export const userRepo = {
  async findPaginated(params: ListUsersParams) {
    const { page, pageSize, search } = params;

    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput =
      search && search.trim().length > 0
        ? {
            OR: [
              {
                email: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                firstName: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {};

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      search,
    };
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
      // Never return the password hash to callers.
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};
