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
  }

  public async getProfile(_: Request, res: Response): Promise<void> {
    try {
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
}
