import { DatabaseService } from "../../src/services/database.service";
import { Repository } from "typeorm";
import { History } from "../../src/entities/history";
import { User } from "../../src/entities/user";
import { hashPassword } from "../../src/utils/auth.utils";
import { USERS } from "./users";

export class Seeder {
  private historyRepo!: Repository<History>;
  private userRepo!: Repository<User>;

  public constructor(databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);
  }

  public async seed(): Promise<void> {
    await Promise.allSettled(USERS.map(this.seedUser.bind(this)));

    await Promise.allSettled([
      this.seedHistory(USERS[0].username, { score: 23 }),
      this.seedHistory(USERS[1].username, { score: 108 }),
      this.seedHistory(USERS[0].username, { score: 16 }),
      this.seedHistory(USERS[2].username, { score: 42 }),
      this.seedHistory(USERS[1].username, { score: 8 }),
      this.seedHistory(USERS[0].username, { score: 4 }),
      this.seedHistory(USERS[3].username, { score: 815 }),
    ]);
  }

  private async seedUser(user: Omit<User, "id" | "histories">): Promise<void> {
    const hashedPassword = await hashPassword(user.password);
    await this.userRepo.save({ ...user, password: hashedPassword });
  }

  private async seedHistory(
    username: string,
    history: Omit<History, "id" | "user">,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      console.warn(`Username "${username}" not found.`);
      return;
    }

    await this.historyRepo.save({ ...history, user });
  }
}
