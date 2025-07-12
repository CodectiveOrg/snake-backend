import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { DatabaseService } from "../services/database.service";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const historyController = new HistoryController(databaseService);

  router.post(
    "/history/",
    historyController.createHistory.bind(historyController),
  );
  router.get(
    "/leaderboard/",
    historyController.readLeaderboard.bind(historyController),
  );
  router.post("/rank/", historyController.readUserRank.bind(historyController));

  return router;
}
