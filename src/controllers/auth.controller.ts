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
  }

  public async signUp(req: Request, res: Response): Promise<void> {
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
  }

  public async signIn(req: Request, res: Response): Promise<void> {
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
