// src/modules/settings/settings.controller.ts
import type { Request, Response, NextFunction } from "express";
import { settingsService } from "./settings.service";
import type { UpdateSettingsBody } from "./settings.validation";

export const settingsController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const settings = await settingsService.getSettings(userId);
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const body = req.body as UpdateSettingsBody;
      const settings = await settingsService.updateSettings(userId, body);
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },
};
