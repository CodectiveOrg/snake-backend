import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import swaggerUi from "swagger-ui-express";

import "dotenv/config";
import "reflect-metadata";

import swaggerDocs from "@/swagger/swagger.json";

import { globalErrorHandler } from "@/handlers/global-error.handler";

import { generateAuthRoutes } from "@/routes/auth.route";
import { generateHistoryRoutes } from "@/routes/history.route";
import { generateProfileRoutes } from "@/routes/profile.route";
import { generatePublicRoutes } from "@/routes/public.route";
import { generateSettingsRoutes } from "@/routes/settings.route";

import { DatabaseService } from "@/services/database.service";

import { validateEnv } from "@/utils/env.utils";

const PORT = process.env.PORT || 5000;

async function main(): Promise<void> {
  validateEnv();

  const databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  const app = express();
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({ origin: true, credentials: true }));

  app.use("/api", generatePublicRoutes(databaseService));
  app.use("/api/auth", generateAuthRoutes(databaseService));
  app.use("/api/history", generateHistoryRoutes(databaseService));
  app.use("/api/profile", generateProfileRoutes(databaseService));
  app.use("/api/settings", generateSettingsRoutes(databaseService));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().then();
