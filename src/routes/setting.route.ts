import { Router } from "express";
import { DatabaseService } from "../services/database.service";
import { SettingController } from "../controllers/setting.controller";

export function generateSettingRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new SettingController(databaseService);

  router.post("/get", controller.getUserSetting);

  return router;
}
