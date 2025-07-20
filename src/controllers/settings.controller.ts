import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { Settings } from "../entities/settings";
import { User } from "../entities/user";
import { fetchUserFromToken } from "../utils/api.utils";
import { SettingsEditResponseDto } from "../dto/settings-response.dto";

export class SettingsController {
  private readonly settingsRepo;
  private readonly userRepo;

  public constructor(databaseService: DatabaseService) {
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.editSettings = this.editSettings.bind(this);
  }

  public async editSettings(
    req: Request,
    res: Response<SettingsEditResponseDto>,
  ): Promise<void> {
    const body = EditSettingsBodySchema.parse(req.body);
    const user = await fetchUserFromToken(res, this.userRepo);

    await this.settingsRepo.save({
      music: body.music,
      sfx: body.sfx,
      user: user,
    });

    res.status(200).send({
      statusCode: 200,
      message: "Settings fetched successfully.",
    });
  }
}

const EditSettingsBodySchema = z.object({
  music: z.number().min(0).max(10),
  sfx: z.number().min(0).max(10),
});
