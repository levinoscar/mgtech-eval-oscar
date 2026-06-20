// src/modules/users/user.controller.ts
import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import type { ListUsersQuery, CreateUserBody } from "./user.validation";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // validateQuery has already coerced + defaulted these values.
      const { page, pageSize, search } = req.query as unknown as ListUsersQuery;

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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // validateBody guarantees a clean, typed body here.
      const body = req.body as CreateUserBody;

      const user = await userService.createUser(body);

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};
