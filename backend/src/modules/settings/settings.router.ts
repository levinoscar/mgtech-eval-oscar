// src/modules/settings/settings.router.ts
import { Router } from "express";
import { settingsController } from "./settings.controller";
import { requireAuth, requireSelfOrAdmin } from "../../middlewares/authGuard";
import { validateBody } from "../../middlewares/validation";
import { updateSettingsBodySchema } from "./settings.validation";

// mergeParams lets this router read :userId from the mount path
// (app.use("/users/:userId/settings", ...)).
export const settingsRouter = Router({ mergeParams: true });

// GET /users/:userId/settings
settingsRouter.get(
  "/",
  requireAuth,
  requireSelfOrAdmin("userId"),
  settingsController.get
);

// PUT /users/:userId/settings
settingsRouter.put(
  "/",
  requireAuth,
  requireSelfOrAdmin("userId"),
  validateBody(updateSettingsBodySchema),
  settingsController.update
);
