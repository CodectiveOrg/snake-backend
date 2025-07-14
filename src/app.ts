import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { generatePublicRoutes } from "./routes/public.route";

import { DatabaseService } from "./services/database.service";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

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

  app.use("/api/", generatePublicRoutes(databaseService));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().then();
