import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generateProfileRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new ProfileController(databaseService);

  router.get("/", authMiddleware, controller.getProfile);
  router.patch("/edit-profile", authMiddleware, controller.editProfile);

  return router;
}
