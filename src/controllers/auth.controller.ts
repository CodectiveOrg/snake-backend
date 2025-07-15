import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";
import {
  comparePasswords,
  generateToken,
  hashPassword,
} from "../utils/auth.utils";
import { mapToTokenPayload } from "../utils/mapper.utils";

export class AuthController {
  private userRepo;

  public constructor(databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.verify = this.verify.bind(this);
    this.helloFriend = this.helloFriend.bind(this);
  }

  public async signUp(req: Request, res: Response): Promise<void> {
    try {
      const body = SignUpBodySchema.parse(req.body);
      const { username, email, password } = body;

      const user = await this.userRepo.findOne({
        where: [{ username }, { email }],
      });

      if (user) {
        res.status(400).json({ error: "Username or email is already taken." });
        return;
      }

      const hashedPassword = await hashPassword(password);
      await this.userRepo.save({ ...body, password: hashedPassword });

      generateToken(res, mapToTokenPayload(body));

      res.json({ message: "Signed up successfully." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).send({
          status: "error",
          message: "Invalid input",
          details: error.issues,
        });
      } else if (error instanceof Error) {
        console.error(error);
        res.status(500).send({
          message: "Unexpected error",
          error: error.message,
        });
      } else {
        console.error(error);
        res.status(500).send({
          message: "Unexpected error",
          error: "Unknown error",
        });
      }
    }
  }

  public async signIn(req: Request, res: Response): Promise<void> {
    try {
      const body = SignInBodySchema.parse(req.body);
      const { username, password } = body;

      const user = await this.userRepo.findOne({ where: { username } });

      if (!user) {
        res.status(401).json({ error: "Username or password is incorrect." });
        return;
      }

      const isPasswordCorrect = await comparePasswords(password, user.password);

      if (!isPasswordCorrect) {
        res.status(401).json({ error: "Username or password is incorrect." });
        return;
      }

      generateToken(res, mapToTokenPayload(user));

      res.json({ message: "Signed in successfully." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).send({
          status: "error",
          message: "Invalid input",
          details: error.issues,
        });
      } else {
        res.status(500).send({
          status: "error",
          message: "Unexpected error",
          details: "Internal server error",
        });
      }
    }
  }

  public async signOut(_: Request, res: Response): Promise<void> {
    res.clearCookie(process.env.TOKEN_KEY!);
    res.json({ message: "Signed out successfully." });
  }

  public async verify(_: Request, res: Response): Promise<void> {
    const { user } = res.locals;

    if (!user) {
      res.sendStatus(401);
      return;
    }

    res.json({ user });
  }

  public async helloFriend(_: Request, res: Response): Promise<void> {
    res.json({ message: "Hello, friend!" });
  }
}

const SignUpBodySchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

const SignInBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});
