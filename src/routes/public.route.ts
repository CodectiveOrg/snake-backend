import express from "express";
import { homeEndpoint } from "../controllers/public/home.endpoint";

const publicRouter = express.Router();

publicRouter.get("/", homeEndpoint);

export { publicRouter };
