import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { History } from "../entities/history";
import { User } from "../entities/user";

export class HistoryController {
  private historyRepo;
  private userRepo;

  public constructor(private databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.createHistory = this.createHistory.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.getUserRank = this.getUserRank.bind(this);
    this.getHighScore = this.getHighScore.bind(this);
  }

  public async createHistory(req: Request, res: Response): Promise<void> {
    try {
      const { username } = res.locals.user;

      const body = CreateHistoryBodySchema.parse(req.body);
      const { score } = body;

      const user = await this.userRepo.findOne({ where: { username } });

      if (!user) {
        res.status(401).send();
        return;
      }

      await this.historyRepo.save({ score, user });

      res.status(201).send({
        status: "success",
        message: "History created successfully.",
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

  public async getLeaderboard(_: Request, res: Response): Promise<void> {
    const records = await this.historyRepo
      .createQueryBuilder("history")
      .select("history.username", "username")
      .addSelect("MAX(history.score)", "highScore")
      .groupBy("username")
      .orderBy("history.score", "DESC")
      .limit(5)
      .getRawMany();

    res.status(200).send({
      status: "success",
      message: "Leaderboard fetched successfully.",
      data: records,
    });
  }

  public async getUserRank(req: Request, res: Response): Promise<void> {
    try {
      const body = GetUserRankBodySchema.parse(req.body);
      const { username } = body;

      const records = await this.databaseService.dataSource
        .createQueryBuilder()
        .select()
        .from(
          (subQuery) =>
            subQuery
              .select("history.username", "username")
              .addSelect("MAX(history.score)", "highScore")
              .addSelect("ROW_NUMBER() OVER (ORDER BY score DESC)", "rank")
              .from(History, "history")
              .groupBy("history.username")
              .orderBy("history.score", "DESC"),
          "t"
        )
        .where("t.username = :username", { username })
        .getRawMany();

      res.status(200).send({
        status: "success",
        message: "User's rank fetched successfully.",
        data: records,
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

  public async getHighScore(req: Request, res: Response): Promise<void> {
    try {
      const { username } = res.locals.user;
      // const body = GetHighScoreSchema.parse(req.body);
      // const { user } = body;

      const user = await this.userRepo.findOne({ where: { username } });

      if (!user) {
        res.sendStatus(401);
        return;
      }
      const record = await this.databaseService.dataSource
        .createQueryBuilder()
        .select("history.username", "username")
        .addSelect("MAX(history.score)", "highScore")
        .from(History, "history")
        .where("history.username = :user", { username })
        .groupBy("history.username")
        .getRawOne();

      res.status(200).send({
        status: "success",
        message: "Player's high score fetched successfully.",
        data: record,
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

const CreateHistoryBodySchema = z.object({
  username: z.string(),
  score: z.number(),
});

const GetUserRankBodySchema = z.object({
  username: z.string(),
});

const GetHighScoreSchema = z.object({
  username: z.string(),
});
