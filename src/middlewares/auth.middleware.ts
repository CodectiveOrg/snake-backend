import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { TokenPayloadModel } from "../models/token.payload";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.process.env.TOKEN_KE!;
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRE!
    ) as TokenPayloadModel;
    res.locals.user = payload.user;
    next();
  } catch {
    res.clearCookie("token");
    res.sendStatus(401);
  }
};
