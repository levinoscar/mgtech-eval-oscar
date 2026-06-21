// src/modules/settings/settings.repo.ts
import { prisma } from "../../db/prismaClient";
import type { UpdateSettingsBody } from "./settings.validation";

export const settingsRepo = {
  findByUserId(userId: string) {
    return prisma.userSettings.findUnique({ where: { userId } });
  },

  // Create the row with defaults if it doesn't exist, otherwise update it.
  upsert(userId: string, data: UpdateSettingsBody) {
    return prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: { ...data },
    });
  },
};
