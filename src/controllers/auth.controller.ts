import { Request, Response } from "express";

import { Like } from "typeorm";

import { z } from "zod";

import { EmailSchema } from "@/validation/schemas/email.schema";
import { PasswordSchema } from "@/validation/schemas/password.schema";
import { UsernameSchema } from "@/validation/schemas/username.schema";

import {
  AuthSignInResponseDto,
  AuthSignOutResponseDto,
  AuthSignUpResponseDto,
  AuthVerifyResponseDto,
} from "@/dto/auth-response.dto";

import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";

import {
  comparePasswords,
  generateToken,
  hashPassword,
} from "@/utils/auth.utils";
import { mapToTokenPayload } from "@/utils/mapper.utils";

export class AuthController {
  private readonly userRepo;

  public constructor(databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.verify = this.verify.bind(this);
  }

  public async signUp(
    req: Request,
    res: Response<AuthSignUpResponseDto>,
  ): Promise<void> {
    const body = SignUpBodySchema.parse(req.body);
    const { username, email, password } = body;

    const user = await this.userRepo.findOne({
      where: [{ username: Like(username) }, { email: Like(email) }],
    });

    if (user) {
      res.status(409).json({
        statusCode: 409,
        message: "Username or email is already taken.",
        error: "Conflict",
      });

      return;
    }

    const hashedPassword = await hashPassword(password);
    await this.userRepo.save({ ...body, password: hashedPassword });

    generateToken(res, mapToTokenPayload(body));

    res.status(201).json({
      statusCode: 201,
      message: "Signed up successfully.",
    });
  }

  public async signIn(
    req: Request,
    res: Response<AuthSignInResponseDto>,
  ): Promise<void> {
    const body = SignInBodySchema.parse(req.body);
    const { username, password } = body;

    const user = await this.userRepo.findOne({
      where: { username: Like(username) },
    });

    if (!user) {
      res.status(401).json({
        statusCode: 401,
        message: "Username or password is incorrect.",
        error: "Unauthorized",
      });

      return;
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        statusCode: 401,
        message: "Username or password is incorrect.",
        error: "Unauthorized",
      });

      return;
    }

    generateToken(res, mapToTokenPayload(user));

    res.json({
      statusCode: 200,
      message: "Signed in successfully.",
    });
  }

  public async signOut(
    _: Request,
    res: Response<AuthSignOutResponseDto>,
  ): Promise<void> {
    res.clearCookie(process.env.TOKEN_KEY!);

    res.json({
      statusCode: 200,
      message: "Signed out successfully.",
    });
  }

  public async verify(
    _: Request,
    res: Response<AuthVerifyResponseDto>,
  ): Promise<void> {
    const { user } = res.locals;

    if (!user) {
      res.sendStatus(401);
      return;
    }

    res.json({
      statusCode: 200,
      message: "Token is valid.",
      result: user,
    });
  }
}

const SignUpBodySchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

const SignInBodySchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});
