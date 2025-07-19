import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { UserController } from "../controllers/user.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const historyController = new HistoryController(databaseService);
  const userController = new UserController(databaseService);

  router.post("/history", authMiddleware, historyController.createHistory);
  router.get("/leaderboard", historyController.getLeaderboard);
  router.post("/rank", historyController.getUserRank);
  router.get("/high-score", authMiddleware, historyController.getHighScore);
  router.get("/:userName", userController.getUser);

  return router;
}
