import { Response } from "express";

import { Repository } from "typeorm";

import { User } from "@/entities/user";

export async function fetchUserFromToken(
  res: Response,
  userRepo: Repository<User>,
): Promise<User> {
  const { username } = res.locals.user;

  const user = await userRepo.findOne({ where: { username } });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}
