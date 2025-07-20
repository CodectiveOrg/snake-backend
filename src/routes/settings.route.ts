import { Router } from "express";

import { SettingsController } from "@/controllers/settings.controller";

import { authMiddleware } from "@/middlewares/auth.middleware";

import { DatabaseService } from "@/services/database.service";

export function generateSettingsRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new SettingsController(databaseService);

  router.post("/", authMiddleware, controller.editSettings);

  return router;
}
