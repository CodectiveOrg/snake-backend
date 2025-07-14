import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { History } from "../entities/history";

export class HistoryController {
  private historyRepo;

  public constructor(private databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
  }

  public async createHistory(req: Request, res: Response): Promise<void> {
    const { username, score } = req.body;

    const history = new History();
    history.username = username;
    history.score = score;

    await this.historyRepo.save(history);

    res.status(201).send({
      status: "success",
      message: "History created successfully.",
    });
  }

  public async getLeaderboard(req: Request, res: Response): Promise<void> {
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
    const { username } = req.body;

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
}
