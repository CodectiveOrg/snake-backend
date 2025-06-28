import { DataTypes, Sequelize } from "sequelize";

export class DatabaseService {
  public sequelize: Sequelize;
  public History: ReturnType<Sequelize["define"]>;

  public constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "database/snake.sqlite",
    });

    this.History = this.sequelize.define(
      "History",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        charset: "utf8",
      },
    );
  }

  public async init(): Promise<boolean> {
    if (!(await this.isConnected())) {
      return false;
    }

    await this.sequelize.sync();

    return true;
  }

  private async isConnected(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return false;
    }
  }
}
