import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { History } from "../entities/history";
import { User } from "../entities/user";
import { fetchUserFromToken } from "../utils/api.utils";
import {
  CreateHistoryResponseDto,
  GetHighScoreResponseDto,
  GetLeaderboardResponseDto,
  GetUserHistoryResponseDto,
  GetUserPublicInfoResponseDto,
  GetUserRankResponseDto,
} from "../dto/response.dto";

export class PublicController {
  private readonly historyRepo;
  private readonly userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.createHistory = this.createHistory.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.getUserRank = this.getUserRank.bind(this);
    this.getHighScore = this.getHighScore.bind(this);
    this.getUserPublicInfo = this.getUserPublicInfo.bind(this);
    this.getUserHistory = this.getUserHistory.bind(this);
  }

  public async createHistory(
    req: Request,
    res: Response<CreateHistoryResponseDto>,
  ): Promise<void> {
    const body = CreateHistoryBodySchema.parse(req.body);
    const user = await fetchUserFromToken(res, this.userRepo);

    await this.historyRepo.save({ score: body.score, user });

    res.status(201).json({
      statusCode: 201,
      message: "History created successfully.",
    });
  }

  public async getLeaderboard(
    _: Request,
    res: Response<GetLeaderboardResponseDto>,
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

  public async getUserRank(
    _: Request,
    res: Response<GetUserRankResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    const record = await this.databaseService.dataSource
      .createQueryBuilder()
      .select("user.username", "username")
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
      message: "User's rank fetched successfully.",
      result: record,
    });
  }

  public async getHighScore(
    _: Request,
    res: Response<GetHighScoreResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    const record = await this.databaseService.dataSource
      .createQueryBuilder()
      .select("MAX(history.score)", "highScore")
      .from(History, "history")
      .where("history.userId = :userId", { userId: user.id })
      .groupBy("history.userId")
      .getRawOne();

    res.json({
      statusCode: 200,
      message: "Player's high score fetched successfully.",
      result: record,
    });
  }

  public async getUserPublicInfo(
    req: Request,
    res: Response<GetUserPublicInfoResponseDto>,
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

  public async getUserHistory(
    _: Request,
    res: Response<GetUserHistoryResponseDto>,
  ): Promise<void> {
    const user = await fetchUserFromToken(res, this.userRepo);

    const records = await this.historyRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: "DESC" },
      select: { score: true, createdAt: true },
    });

    res.status(200).send({
      statusCode: 200,
      message: "User's history fetched successfully.",
      result: records,
    });
  }
}

const CreateHistoryBodySchema = z.object({
  username: z.string(),
  score: z.number(),
});

const GetUserPublicInfoBodySchema = z.object({
  username: z.string(),
});
