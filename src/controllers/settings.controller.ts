import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { Settings } from "../entities/settings";
import { User } from "../entities/user";

export class SettingsController {
  private settingsRepo;

  public constructor(private databaseService: DatabaseService) {
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);
    this.getUserSettings = this.getUserSettings.bind(this);
  }

  public async getUserSettings(req: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;
    const user = await this.databaseService.dataSource
      .getRepository(User)
      .findOne({ where: { username }, relations: ["settings"] });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const result = GetUserSettings.safeParse(req.body);

    if (!result.success) {
      res.status(400).send({
        status: "error",
        message: "Invalid input",
        details: result.error.issues,
      });
      return;
    }

    const { sfx, music } = result.data;

    if (!user.settings) {
      await this.databaseService.dataSource
        .getRepository(Settings)
        .save({ username: user.username, sfx, music });
    } else {
      await this.databaseService.dataSource
        .getRepository(Settings)
        .save({ username: user.username, sfx, music });
    }

    res.status(201).send({
      status: "success",
      message: "Settings fetched successfully.",
    });
  }
}

const GetUserSettings = z.object({
  username: z.string(),
  sfx: z.number(),
  music: z.number(),
});
