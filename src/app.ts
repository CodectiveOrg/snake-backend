import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../swagger.json";
import "reflect-metadata";

import { generatePublicRoutes } from "./routes/public.route";

import { DatabaseService } from "./services/database.service";

import "dotenv/config";

const PORT = process.env.PORT || 5000;

async function main(): Promise<void> {
  const databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.use("/api", generatePublicRoutes(databaseService));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().then();
