const multer = require("multer");
import { Router } from "express";
import { PictureController } from "../controllers/picture.controller";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export function generatePictureRoutes(
  databaseService: DatabaseService,
): Router {
  const router = Router();
  const upload = multer();
  const controller = new PictureController(databaseService);

  router.post(
    "/edit",
    authMiddleware,
    upload.single("picture"),
    controller.editPicture,
  );

  return router;
}
