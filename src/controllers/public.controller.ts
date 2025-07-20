import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { History } from "../entities/history";
import { User } from "../entities/user";
import {
  PublicGetLeaderboardResponseDto,
  PublicGetUserPublicInfoResponseDto,
} from "../dto/response.dto";

export class PublicController {
  private readonly historyRepo;
  private readonly userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.getUserPublicInfo = this.getUserPublicInfo.bind(this);
  }

  public async getLeaderboard(
    _: Request,
    res: Response<PublicGetLeaderboardResponseDto>,
  ): Promise<void> {
    const records = await this.historyRepo
      .createQueryBuilder("history")
      .select("user.username", "username")
      .addSelect("MAX(history.score)", "highScore")
      .leftJoin("history.user", "user")
      .groupBy("username")
      .orderBy("history.score", "DESC")
      .limit(5)
      .getRawMany();

    res.json({
      statusCode: 200,
      message: "Leaderboard fetched successfully.",
      result: records,
    });
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
