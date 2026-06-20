import { Router } from "express";
import { userController } from "./user.controller";
import { validateBody, validateQuery } from "../../middlewares/validation";
import { listUsersQuerySchema, createUserBodySchema } from "./user.validation";

export const userRouter = Router();

// GET /users
userRouter.get("/", validateQuery(listUsersQuerySchema), userController.list);

// POST /users
userRouter.post("/", validateBody(createUserBodySchema), userController.create);
