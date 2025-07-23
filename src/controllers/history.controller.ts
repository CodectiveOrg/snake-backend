import { Request, Response } from "express";

import { z } from "zod";

import {
  HistoryCreateHistoryResponseDto,
  HistoryGetHighScoreResponseDto,
  HistoryGetLeaderboardResponseDto,
  HistoryGetUserHistoryResponseDto,
  HistoryGetUserRankResponseDto,
} from "@/dto/history-response.dto";

import { History } from "@/entities/history";
import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";
import { LeaderboardService } from "@/services/leaderboard.service";

import { fetchUserFromToken } from "@/utils/api.utils";

export class HistoryController {
  private readonly historyRepo;
  private readonly userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getUserHistory = this.getUserHistory.bind(this);
    this.createHistory = this.createHistory.bind(this);
    this.getUserRank = this.getUserRank.bind(this);
    this.getHighScore = this.getHighScore.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  public async getUserHistory(
    _: Request,
    res: Response<HistoryGetUserHistoryResponseDto>,
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

  public async createHistory(
    req: Request,
    res: Response<HistoryCreateHistoryResponseDto>,
  ): Promise<void> {
    const body = CreateHistoryBodySchema.parse(req.body);
    const user = await fetchUserFromToken(res, this.userRepo);

    await this.historyRepo.save({ score: body.score, user });

    res.status(201).json({
      statusCode: 201,
      message: "History created successfully.",
    });
  }

  public async getUserRank(
    _: Request,
    res: Response<HistoryGetUserRankResponseDto>,
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
    res: Response<HistoryGetHighScoreResponseDto>,
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

  public async getLeaderboard(
    _: Request,
    res: Response<HistoryGetLeaderboardResponseDto>,
  ): Promise<void> {
    const { username } = res.locals.user;

    const leaderboardService = new LeaderboardService(this.databaseService);
    const records = await leaderboardService.getLeaderboard(username);

    res.json({
      statusCode: 200,
      message: "Leaderboard fetched successfully.",
      result: records,
    } as HistoryGetLeaderboardResponseDto);
  }
}

const CreateHistoryBodySchema = z.object({
  username: z.string(),
  score: z.number(),
});
