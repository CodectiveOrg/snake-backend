import { RequestHandler } from "express";

export const homeEndpoint: RequestHandler = (req, res): void => {
  res.send("Hello Friend");
};
