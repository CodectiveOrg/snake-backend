import { Request, Response } from "express";
import { Sequelize } from "sequelize";

import { DatabaseService } from "../services/database.service";

export class HistoryController {
  public constructor(private databaseService: DatabaseService) {}

  public async createHistory(req: Request, res: Response): Promise<void> {
    const { username, score } = req.body;

    this.databaseService.History.create({ username, score });

    res.status(201).send({
      status: "success",
      message: "History created successfully.",
    });
  }

  public async readLeaderboard(req: Request, res: Response): Promise<void> {
    const records = await this.databaseService.History.findAll({
      attributes: [
        "username",
        [Sequelize.fn("MAX", Sequelize.col("score")), "score"],
      ],
      group: "username",
      order: [["score", "DESC"]],
      limit: 5,
    });

    res.status(200).send({
      status: "success",
      message: "Leaderboard read successfully.",
      data: records,
    });
  }
}
