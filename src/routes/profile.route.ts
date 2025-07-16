import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generateProfileRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new ProfileController(databaseService);

  router.get("/info", authMiddleware, controller.getProfileInfo);

  return router;
}
