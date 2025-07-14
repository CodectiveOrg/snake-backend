import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TokenPayload } from "../types/token-payload";

export function generateToken(res: Response, payload: TokenPayload): void {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
    expiresIn: "3d",
  });

  res.cookie(process.env.TOKEN_KEY!, token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 3 * 24 * 3600 * 1000,
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
  password: string,
  hashed: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}
