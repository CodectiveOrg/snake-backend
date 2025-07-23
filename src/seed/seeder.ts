import { Repository } from "typeorm";

import { History } from "@/entities/history";
import { Settings } from "@/entities/settings";
import { User } from "@/entities/user";

import { DatabaseService } from "@/services/database.service";

import { hashPassword } from "@/utils/auth.utils";
import { generateRandomDate } from "@/utils/random.utils";

import { USERS } from "./users";

export class Seeder {
  private historyRepo!: Repository<History>;
  private settingsRepo!: Repository<Settings>;
  private userRepo!: Repository<User>;

  public constructor(databaseService: DatabaseService) {
    this.historyRepo = databaseService.dataSource.getRepository(History);
    this.userRepo = databaseService.dataSource.getRepository(User);
    this.settingsRepo = databaseService.dataSource.getRepository(Settings);
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

    await Promise.allSettled([
      this.seedSettings(USERS[0].username, { music: 1, sfx: 0 }),
      this.seedSettings(USERS[1].username, { music: 0, sfx: 1 }),
      this.seedSettings(USERS[2].username, { music: 1, sfx: 1 }),
      this.seedSettings(USERS[3].username, { music: 0, sfx: 0 }),
    ]);
  }

  private async seedUser(
    user: Omit<User, "id" | "histories" | "settings">,
  ): Promise<void> {
    const hashedPassword = await hashPassword(user.password);
    await this.userRepo.save({ ...user, password: hashedPassword });
  }

  private async seedHistory(
    username: string,
    history: Omit<History, "id" | "user" | "createdAt">,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      console.warn(`Username "${username}" not found.`);
      return;
    }

    await this.historyRepo.save({
      ...history,
      user,
      createdAt: generateRandomDate(),
    });
  }

  private async seedSettings(
    username: string,
    settings: Omit<Settings, "id" | "user">,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      console.warn(`Username "${username}" not found for settings.`);
      return;
    }

    await this.settingsRepo.save({ ...settings, user });
  }
}
