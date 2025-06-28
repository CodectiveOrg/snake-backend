import { Request, Response } from "express";

import { DatabaseService } from "../services/database.service";

export class PublicController {
  public constructor(private databaseService: DatabaseService) {}

  public async post(req: Request, res: Response): Promise<void> {
    const username = req.body.username;

    const record = this.databaseService.History.build({ username, score: 0 });
    await record.save();

    res.send(`Hello, ${username}!`);
  }
}
