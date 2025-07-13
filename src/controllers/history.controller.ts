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

  public async readLeaderboard(req: Request, res: Response): Promise<void> {
    const records = await this.historyRepo
      .createQueryBuilder("history")
      .select("history")
      .from(History, "history")
      .groupBy("history.user.id")
      .orderBy("history.user.username")
      .limit(5)
      .getMany();

    // const records = await this.databaseService.History.findAll({
    //   attributes: [
    //     "username",
    //     [Sequelize.fn("MAX", Sequelize.col("score")), "score"],
    //   ],
    //   group: "username",
    //   order: [["score", "DESC"]],
    //   limit: 5,
    // });

    res.status(200).send({
      status: "success",
      message: "Leaderboard read successfully.",
      data: records,
    });
  }

  public async readUserRank(req: Request, res: Response): Promise<void> {
    // const { username } = req.body;
    //
    // const records = await this.databaseService.sequelize.query(
    //   `
    //   SELECT * FROM
    //   (
    //       SELECT username, max(score) as score, ROW_NUMBER() OVER (ORDER BY score DESC) AS rank
    //           FROM Histories
    //           GROUP BY username
    //           ORDER BY score DESC
    //   ) AS t
    //   WHERE t.username = ?;
    // `,
    //   {
    //     type: QueryTypes.SELECT,
    //     replacements: [username],
    //   },
    // );

    res.status(200).send({
      status: "success",
      message: "Leaderboard read successfully.",
      data: [],
    });
  }
}
