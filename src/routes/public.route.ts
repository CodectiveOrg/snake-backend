import { Router } from "express";
import { PublicController } from "../controllers/public.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const publicController = new PublicController(databaseService);

  router.post("/history", authMiddleware, publicController.createHistory);
  router.get("/leaderboard", publicController.getLeaderboard);
  router.post("/rank", publicController.getUserRank);
  router.get("/high-score", authMiddleware, publicController.getHighScore);
  router.get("/user/:username", publicController.getUserPublicInfo);
  router.get("/player-history", publicController.getPlayerHistory);

  return router;
}
