import { Router } from "express";

import { HistoryController } from "@/controllers/history.controller";

import { authMiddleware } from "@/middlewares/auth.middleware";

import { DatabaseService } from "@/services/database.service";

export function generateHistoryRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const controller = new HistoryController(databaseService);

  router.get("/", authMiddleware, controller.getUserHistory);
  router.post("/", authMiddleware, controller.createHistory);
  router.get("/stats", authMiddleware, controller.getStats);
  router.get("/leaderboard", authMiddleware, controller.getLeaderboard);

  return router;
}
