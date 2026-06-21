// src/modules/settings/settings.service.ts
import { settingsRepo } from "./settings.repo";
import { userRepo } from "../users/user.repo";
import type { UpdateSettingsBody } from "./settings.validation";

function userNotFound() {
  const err: any = new Error("User not found");
  err.status = 404;
  err.code = "USER_NOT_FOUND";
  return err;
}

export const settingsService = {
  // Returns the user's settings, lazily materializing defaults on first read
  // so callers always get a complete settings object for a valid user.
  async getSettings(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw userNotFound();

    const existing = await settingsRepo.findByUserId(userId);
    if (existing) return existing;

    return settingsRepo.upsert(userId, {});
  },

  async updateSettings(userId: string, data: UpdateSettingsBody) {
    const user = await userRepo.findById(userId);
    if (!user) throw userNotFound();

    return settingsRepo.upsert(userId, data);
  },
};
