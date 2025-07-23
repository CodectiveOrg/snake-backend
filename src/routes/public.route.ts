import { Router } from "express";

import { PublicController } from "@/controllers/public.controller";

import { DatabaseService } from "@/services/database.service";

export function generatePublicRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const controller = new PublicController(databaseService);

  router.get("/user/:username", controller.getUserPublicInfo);

  return router;
}
