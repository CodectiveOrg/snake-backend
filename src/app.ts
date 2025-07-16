import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../swagger.json";
import "reflect-metadata";
import "dotenv/config";

import { validateEnv } from "./utils/env.utils";
import { DatabaseService } from "./services/database.service";
import { generatePublicRoutes } from "./routes/public.route";
import { generateAuthRoutes } from "./routes/auth.route";
import { generateSettingsRoutes } from "./routes/settings.route";

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
  app.use(cors({ credentials: true }));

  app.use("/api", generatePublicRoutes(databaseService));
  app.use("/api/settings", generateSettingsRoutes(databaseService));
  app.use("/api/auth", generateAuthRoutes(databaseService));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().then();
