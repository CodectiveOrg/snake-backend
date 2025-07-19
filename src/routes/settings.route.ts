import { Router } from "express";
import { DatabaseService } from "../services/database.service";
import { SettingsController } from "../controllers/settings.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generateSettingsRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new SettingsController(databaseService);

  router.post("/", authMiddleware, controller.getUserSettings);

  return router;
}
