import { Router } from "express";
import { DatabaseService } from "../services/database.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

export function generateAuthRoutes(databaseService: DatabaseService): Router {
  const router = Router();
  const controller = new AuthController(databaseService);

  router.post("/sign-in", controller.signIn);
  router.post("/sign-up", controller.signUp);
  router.delete("/sign-out", controller.signOut);
  router.get("/verify", authMiddleware, controller.verify);
  router.get("/hello-friend", controller.helloFriend);

  return router;
}
