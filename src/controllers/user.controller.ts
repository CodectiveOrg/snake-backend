import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";

export class UserController {
  private userRepo;

  public constructor(databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.getUser = this.getUser.bind(this);
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    const user = await this.userRepo.findOne({
      where: { username: username },
      select: { username: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).send({
      status: "success",
      message: "User's info fetched successfully.",
      data: user,
    });
  }
}
