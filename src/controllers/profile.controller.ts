import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";

export class ProfileController {
  private profileRepo;

  public constructor(private databaseService: DatabaseService) {
    this.profileRepo = databaseService.dataSource.getRepository(User);

    this.getProfileInfo = this.getProfileInfo.bind(this);
  }

  public async getProfileInfo(_: Request, res: Response): Promise<void> {
    const { user } = res.locals;

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const info = await this.profileRepo.findOne({
      where: {
        username: user.username,
      },
      select: {
        username: true,
        email: true,
      },
    });

    res.send({
      status: "success",
      message: "Profile info fetched successfully.",
      data: info,
    });
  }
}
