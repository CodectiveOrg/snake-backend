import { Repository } from "typeorm";
import { User } from "../entities/user";
import { Response } from "express";
import { z, ZodType } from "zod";

type Options<TSchema extends ZodType> = {
  res: Response;
  parseUser?: boolean;
  userRepo: Repository<User>;
  parseBody?: boolean;
  body: z.infer<TSchema>;
  BodySchema: TSchema;
};

type Result<TSchema extends ZodType> =
  | { error: true }
  | {
      user: User | null;
      parsedBody: z.infer<TSchema> | null;
    };

export async function parseRequest<TSchema extends ZodType>({
  res,
  parseUser = true,
  userRepo,
  parseBody = false,
  body,
  BodySchema,
}: Options<TSchema>): Promise<Result<TSchema>> {
  let user: User | null = null;
  let parsedBody: z.infer<TSchema> | null = null;

  if (parseUser) {
    const { username } = res.locals.user;

    user = await userRepo.findOne({ where: { username } });

    if (!user) {
      res.status(401).send({
        statusCode: 401,
        message: "User not found.",
        error: "Unauthorized",
      });

      return { error: true };
    }
  }

  if (parseBody) {
    parsedBody = BodySchema.parse(body);
  }

  return { user, parsedBody };
}

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
