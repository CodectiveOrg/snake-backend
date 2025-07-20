import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { History } from "../entities/history";
import { Settings } from "../entities/settings";

export class DatabaseService {
  public dataSource: DataSource;

  public constructor() {
    this.dataSource = new DataSource({
      type: "sqlite",
      database: "database/snake.sqlite",
      entities: [User, History, Settings],
      synchronize: true,
      logging: false,
    });
  }

  public async init(): Promise<boolean> {
    return await this.isConnected();
  }

  private async isConnected(): Promise<boolean> {
    try {
      await this.dataSource.initialize();
      console.log("Connection has been established successfully.");
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return false;
    }
  }
}
