import { Request, Response } from "express";

import { SettingsSchema } from "@/validation/schemas/settings.schema";

import {
  SettingsEditResponseDto,
  SettingsGetResponseDto,
} from "@/dto/settings-response.dto";

import { Settings } from "@/entities/settings";
import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";

import { fetchUserFromToken } from "@/utils/api.utils";

export class SettingsController {
  private readonly settingsRepo;
  private readonly userRepo;

  public constructor(databaseService: DatabaseService) {
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.editSettings = this.editSettings.bind(this);
    this.getSettings = this.getSettings.bind(this);
  }

  public async getSettings(
    _: Request,
    res: Response<SettingsGetResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    const record = await this.settingsRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!record) {
      res.status(404).send({
        statusCode: 404,
        message: "User's settings not found.",
        error: "Not Found",
      });

      return;
    }

    res.status(200).send({
      statusCode: 200,
      message: "Settings fetched successfully.",
      result: record,
    });
  }

  public async editSettings(
    req: Request,
    res: Response<SettingsEditResponseDto>,
  ): Promise<void> {
    const body = SettingsSchema.parse(req.body);
    const user = await fetchUserFromToken(res, this.userRepo);

    await this.settingsRepo.save({
      music: body.music,
      sfx: body.sfx,
      user: user,
    });

    res.status(200).send({
      statusCode: 200,
      message: "Settings changed successfully.",
    });
  }
}
