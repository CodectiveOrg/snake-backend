import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const controller = new HistoryController(databaseService);

  router.post("/history", authMiddleware, controller.createHistory);
  router.get("/leaderboard", controller.getLeaderboard);
  router.post("/rank", controller.getUserRank);
  router.get("/high-score", authMiddleware, controller.getHighScore);
  router.get("/player-history", authMiddleware, controller.getPlayerHistory);

  return router;
}
