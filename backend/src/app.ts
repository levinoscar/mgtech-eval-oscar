import express from "express";
import { json } from "express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./modules/users/user.router";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

export const createApp = () => {
  const app = express();

  app.use(json());

  // basic request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


  // mount feature modules
  app.use("/users", userRouter);

  // error handler should be last
  app.use(errorHandler);

  return app;
};
