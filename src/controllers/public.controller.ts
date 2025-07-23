import { Request, Response } from "express";

import { z } from "zod";

import { PublicGetUserPublicInfoResponseDto } from "@/dto/public-response.dto";

import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";

export class PublicController {
  private readonly userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getUserPublicInfo = this.getUserPublicInfo.bind(this);
  }

  public async getUserPublicInfo(
    req: Request,
    res: Response<PublicGetUserPublicInfoResponseDto>,
  ): Promise<void> {
    const body = GetUserPublicInfoBodySchema.parse(req.body);

    const record = await this.userRepo.findOne({
      where: { username: body.username },
      select: { username: true, email: true, picture: true },
    });

    if (!record) {
      res.status(404).json({
        statusCode: 404,
        message: "User not found",
        error: "Not Found",
      });

      return;
    }

    res.status(200).send({
      statusCode: 200,
      message: "User's public info fetched successfully.",
      result: record,
    });
  }
}

const GetUserPublicInfoBodySchema = z.object({
  username: z.string(),
});
