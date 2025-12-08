import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.listUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      const user = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};
