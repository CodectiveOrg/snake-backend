import { z } from "zod";
import { Request, Response } from "express";
import { QueryTypes, Sequelize } from "sequelize";

import { DatabaseService } from "../services/database.service";

const HistorySchema = z.object({
  username: z.string(),
  score: z.number(),
});

const UserNameSchema = z.object({
  username: z.string(),
});

export class HistoryController {
  public constructor(private databaseService: DatabaseService) {}

  public async createHistory(req: Request, res: Response): Promise<void> {
    const { username, score } = req.body;

    try {
      const historySchema = HistorySchema.parse({ username, score });
      await this.databaseService.History.create(historySchema);

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

  public async readUserRank(req: Request, res: Response): Promise<void> {
    const { username } = req.body;

    try {
      const userNameSchema = UserNameSchema.parse({ username });
      const records = await this.databaseService.sequelize.query(
        `
      SELECT * FROM 
      (
          SELECT username, max(score) as score, ROW_NUMBER() OVER (ORDER BY score DESC) AS rank
              FROM Histories
              GROUP BY username
              ORDER BY score DESC
      ) AS t
      WHERE t.username = ?;
    `,
        {
          type: QueryTypes.SELECT,
          replacements: [userNameSchema],
        },
      );

      res.status(200).send({
        status: "success",
        message: "Leaderboard read successfully.",
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
}
