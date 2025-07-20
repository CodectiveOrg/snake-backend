import { RequestHandler } from "express";

import jwt from "jsonwebtoken";

import { TokenPayload } from "@/types/token-payload";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies[process.env.TOKEN_KEY!];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    res.locals.user = jwt.verify(
      token,
      process.env.TOKEN_SECRET!,
    ) as TokenPayload;

    next();
  } catch {
    res.clearCookie(process.env.TOKEN_KEY!);
    res.sendStatus(401);
  }
};
