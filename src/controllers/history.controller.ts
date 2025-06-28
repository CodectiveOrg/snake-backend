import { Request, Response } from "express";

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
}
