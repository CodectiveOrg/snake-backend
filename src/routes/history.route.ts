import { Router } from "express";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HistoryController } from "../controllers/history.controller";

export function generateHistoryRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new HistoryController(databaseService);

  router.get("/", authMiddleware, controller.getUserHistory);
  router.post("/", authMiddleware, controller.createHistory);
  router.get("/rank", authMiddleware, controller.getUserRank);
  router.get("/high-score", authMiddleware, controller.getHighScore);

  return router;
}
