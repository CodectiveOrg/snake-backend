import { Request, Response } from "express";

import { PublicGetUserPublicInfoResponseDto } from "@/dto/public-response.dto";

import { History } from "@/entities/history";
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
    const { username } = req.params;

    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: "User not found.",
        error: "Not found",
      });

      return;
    }

    const record = await this.databaseService.dataSource
      .createQueryBuilder()
      .select("user.username", "username")
      .addSelect("user.gender", "gender")
      .addSelect("user.picture", "picture")
      .addSelect("t.highScore", "highScore")
      .addSelect("t.rank", "rank")
      .from(
        (subQuery) =>
          subQuery
            .select("history.userId", "userId")
            .addSelect("MAX(history.score)", "highScore")
            .addSelect("ROW_NUMBER() OVER (ORDER BY score DESC)", "rank")
            .from(History, "history")
            .groupBy("history.userId")
            .orderBy("history.score", "DESC"),
        "t",
      )
      .leftJoin(User, "user", "user.id = t.userId")
      .where("t.userId = :userId", { userId: user.id })
      .getRawOne();

    res.json({
      statusCode: 200,
      message: "User's public info fetched successfully.",
      result: record,
    });
  }
}
