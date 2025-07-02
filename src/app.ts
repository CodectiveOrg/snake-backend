import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieparser from "cookie-parser"
import "dotenv/config";
import { validateEnv } from "./utils/env.utils";
import { DatabaseService } from "./services/database.service";
import { generatePublicRoutes } from "./routes/public.route";
import { AuthRoute } from "./routes/Authentication .route";
import { dashboardRouter } from "./routes/dashboard.routes";

validateEnv()
const PORT = process.env.PORT || 5000;
async function main(): Promise<void> {
  const databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  const app = express();
  app.use(bodyParser.json());
  app.use(cookieparser())
  app.use(cors());
  app.use(AuthRoute)
  app.use(dashboardRouter)
  app.use("/api/", generatePublicRoutes(databaseService));

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().then();
