import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { DatabaseService } from "../services/database.service";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const controller = new HistoryController(databaseService);

  router.post("/history", controller.createHistory);
  router.get("/leaderboard", controller.getLeaderboard);
  router.post("/rank", controller.getUserRank);

  return router;
}
