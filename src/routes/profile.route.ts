import { Router } from "express";

import multer from "multer";

import { ProfileController } from "@/controllers/profile.controller";

import { authMiddleware } from "@/middlewares/auth.middleware";

import { DatabaseService } from "@/services/database.service";

export function generateProfileRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const upload = multer();
  const controller = new ProfileController(databaseService);

  router.get("/", authMiddleware, controller.getProfile);
  router.patch("/", authMiddleware, controller.editProfile);
  router.post(
    "/picture",
    authMiddleware,
    upload.single("picture"),
    controller.editPicture,
  );

  return router;
}
