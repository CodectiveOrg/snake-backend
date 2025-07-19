import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";
import { z } from "zod";

export class ProfileController {
  private profileRepo;
  private userRepo;

  public constructor(databaseService: DatabaseService) {
    this.profileRepo = databaseService.dataSource.getRepository(User);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
  }

  public async getProfile(_: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;

    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const record = await this.profileRepo.findOne({
      where: { username: user.username },
      select: { username: true, email: true },
    });

    res.send({
      status: "success",
      message: "Profile info fetched successfully.",
      data: record,
    });
  }

  public async editProfile(req: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;

    const body = EditProfileSchema.parse(req.body);

    const user = await this.userRepo.findOne({
      where: { username },
      select: { username: true },
    });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    let record = await this.userRepo.findOne({ where: { username } });

    if (!record) {
      res.status(401).json({
        error: "Username not found.",
      });
      return;
    }

    record = {
      ...record,
      username: body.username ?? record?.username,
      password: body.password ?? record?.password,
      email: body.email ?? record?.email,
    };

    await this.userRepo.save(record);

    res.send({
      status: "success",
      message: "Profile updated successfully.",
    });
  }
}

const EditProfileSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});
