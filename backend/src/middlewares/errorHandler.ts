import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const status = err.status ?? 500;
  const code = err.code ?? "INTERNAL_SERVER_ERROR";
  const message = err.message ?? "Something went wrong";

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
