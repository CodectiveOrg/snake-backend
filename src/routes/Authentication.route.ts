import { Router } from "express";
import express from "express";
import { AuthController } from "../controllers/Auth";
import { authMiddleware } from "../middlewares/auth.middleware";

const AuthRoute: Router = express.Router()
AuthRoute.post("/auth/sign_in", AuthController.SignInEndpoint)
AuthRoute.post("/auth/sign_up", AuthController.SignUPEndpoint)
AuthRoute.delete("/auth/sign_out", AuthController.SignOutEndpoint)
AuthRoute.get("/auth/verify", authMiddleware, AuthController.VerifyEndpoint)
export { AuthRoute }

