// src/modules/auth/auth.router.ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { validateBody } from "../../middlewares/validation";
import { registerBodySchema, loginBodySchema } from "./auth.validation";
import { requireAuth } from "../../middlewares/authGuard";

export const authRouter = Router();

// POST /auth/register
authRouter.post(
  "/register",
  validateBody(registerBodySchema),
  authController.register
);

// POST /auth/login
authRouter.post(
  "/login",
  validateBody(loginBodySchema),
  authController.login
);

// GET /auth/me
authRouter.get("/me", requireAuth, authController.me);
