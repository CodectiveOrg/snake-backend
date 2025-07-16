import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { Settings } from "../entities/settings";

export class SettingsController {
  private settingsRepo;

  public constructor(private databaseService: DatabaseService) {
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);
  }

  public async getUserSettings(req: Request, res: Response): Promise<void> {
    const { user } = res.locals;

    try {
      const body = GetUserSettings.parse(req.body);
      const { sfx, music } = body;

      const settings = new Settings();
      settings.username = user.username;
      settings.sfx = sfx;
      settings.music = music;

      await this.settingsRepo.save(settings);

      res.status(201).send({
        status: "success",
        message: "Settings returned successfully.",
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

const GetUserSettings = z.object({
  username: z.string(),
  sfx: z.number(),
  music: z.number(),
});
