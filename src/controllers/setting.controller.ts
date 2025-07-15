import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { Setting } from "../entities/setting";

export class SettingController {
  private settingRepo;

  public constructor(private databaseService: DatabaseService) {
    this.settingRepo = databaseService.dataSource.getRepository(Setting);
  }

  public async getUserSetting(req: Request, res: Response): Promise<void> {
    try {
      const body = GetUserSetting.parse(req.body);
      const { username, sfx, music } = body;

      const setting = new Setting();
      setting.username = username;
      setting.sfx = sfx;
      setting.music = music;

      await this.settingRepo.save(setting);

      console.log("Repo:", this.settingRepo);

      res.status(201).send({
        status: "success",
        message: "Setting returned successfully.",
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

const GetUserSetting = z.object({
  username: z.string(),
  sfx: z.number(),
  music: z.number(),
});
