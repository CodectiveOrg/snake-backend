import { Request, Response } from "express";
import { DatabaseService } from "../services/database.service";
import { User } from "../entities/user";

export class PictureController {
  private userRepo;

  public constructor(databaseService: DatabaseService) {
    this.userRepo = databaseService.dataSource.getRepository(User);

    this.editPicture = this.editPicture.bind(this);
  }

  public async editPicture(req: Request, res: Response): Promise<void> {
    const { username } = res.locals.user;

    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    if (!req.file) {
      user.picture = null;
      await this.userRepo.save(user);
      res.status(200).json({ message: "The picture removed successfully" });
    } else {
      user.picture = req.file.buffer;
      await this.userRepo.save(user);
      res.status(201).json({ message: "The picture changed successfully" });
    }
  }
}
