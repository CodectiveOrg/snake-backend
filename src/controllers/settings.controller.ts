import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { Settings } from "../entities/settings";
import { User } from "../entities/user";

export class SettingsController {
  private settingsRepo;
  private userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);

    this.getUserSettings = this.getUserSettings.bind(this);

    this.userRepo = databaseService.dataSource.getRepository(User);
  }

  public async getUserSettings(req: Request, res: Response): Promise<void> {
    const result = GetUserSettings.safeParse(req.body);

    const { username } = res.locals.user;

    const user = await this.userRepo.findOne({
      where: { username },
      relations: ["settings"],
    });

    if (!user || !result.success) {
      res.sendStatus(401);
      return;
    }

    const { music, sfx } = result.data;

    await this.settingsRepo.save({ username: user.username, music, sfx });

    res.status(201).send({
      status: "success",
      message: "Settings fetched successfully.",
    });
  }
}

const GetUserSettings = z.object({
  music: z.number().min(0).max(10),
  sfx: z.number().min(0).max(10),
});
