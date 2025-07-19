import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";
import { z } from "zod";
import { assignDefinedValues } from "../utils/object.utils";

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

    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const updatedUser = assignDefinedValues(user, body);
    await this.userRepo.save(updatedUser);

    res.send({
      status: "success",
      message: "Profile updated successfully.",
    });
  }
}

const EditProfileSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});
