import { Request, Response } from "express";
import { z } from "zod";
import { DatabaseService } from "../services/database.service";
import { History } from "../entities/history";
import { User } from "../entities/user";

export class PublicController {
  private historyRepo;
  private userRepo;

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

  public async createHistory(req: Request, res: Response): Promise<void> {
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
        "t",
      )
      .where("t.username = :username", { username })
      .getRawMany();

    res.status(200).send({
      status: "success",
      message: "User's rank fetched successfully.",
      data: records,
    });
  }

  public async getHighScore(_: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;

    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const record = await this.databaseService.dataSource
      .createQueryBuilder()
      .select("MAX(history.score)", "highScore")
      .from(History, "history")
      .where("history.userId = :userId", { userId: user.id })
      .groupBy("history.userId")
      .getRawOne();

    res.status(200).send({
      status: "success",
      message: "Player's high score fetched successfully.",
      data: record,
    });
  }

  public async getUserPublicInfo(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    const user = await this.userRepo.findOne({
      where: { username },
      select: { username: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).send({
      status: "success",
      message: "User's public info fetched successfully.",
      data: user,
    });
  }

  public async getUserHistory(_: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;

    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      res.status(401).send();
      return;
    }

    const records = await this.historyRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: "DESC" },
      select: {
        id: true,
        score: true,
        createdAt: true,
      },
    });

    res.status(200).send({
      status: "success",
      message: "User's history fetched successfully.",
      data: records,
    });
  }
}

const CreateHistoryBodySchema = z.object({
  username: z.string(),
  score: z.number(),
});

const GetUserRankBodySchema = z.object({
  username: z.string(),
});
