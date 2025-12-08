import { Router } from "express";
import { userController } from "./user.controller";

export const userRouter = Router();

// GET /users
userRouter.get("/", userController.list);

// POST /users
userRouter.post("/", userController.create);
