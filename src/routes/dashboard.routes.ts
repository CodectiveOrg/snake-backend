import express from "express";
import DashboardController from "../controllers/dashboard";
import { authMiddleware } from "../middlewares/auth.middleware";

const dashboardRouter = express.Router();
dashboardRouter.get(
  "/dashboard/settings",
  authMiddleware,
  DashboardController.getSettingsEndpoint,
);
export { dashboardRouter };
