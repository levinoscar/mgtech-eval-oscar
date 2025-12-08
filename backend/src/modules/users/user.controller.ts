// src/modules/users/user.controller.ts
import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
      const pageSize = req.query.pageSize
        ? parseInt(String(req.query.pageSize), 10)
        : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await userService.listUsers({ page, pageSize, search });

      res.json({
        success: true,
        data: result.items,
        meta: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages,
          search: result.search ?? null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // if you still expose POST /users, keep this; otherwise you might only use auth/register
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, passwordHash, firstName, lastName, role } = req.body;

      const user = await userService.createUser({
        email,
        password: "", // not used, but CreateUserInput includes password; service uses passwordHash here
        firstName,
        lastName,
        role,
        passwordHash,
      });

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};
