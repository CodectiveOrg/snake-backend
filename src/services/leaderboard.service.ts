import { DatabaseService } from "@/services/database.service";

export class LeaderboardService {
  public constructor(private databaseService: DatabaseService) {}

  public async getLeaderboard(username: string): Promise<unknown> {
    const today = new Date().toISOString().split("T")[0];

    const userScoresQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("u.username", "username")
      .addSelect("h.score", "score")
      .addSelect("h.createdAt", "createdAt")
      .from("history", "h")
      .leftJoin("user", "u", "u.id = h.userId");

    const todayScoresQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("username")
      .addSelect("MAX(score)", "todayHighScore")
      .from("(" + userScoresQB.getQuery() + ")", "us")
      .where("DATE(createdAt) = DATE(?)")
      .groupBy("username");

    const rankedUsersQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("us.username", "username")
      .addSelect("MAX(us.score)", "totalHighScore")
      .addSelect(`COALESCE(ts.todayHighScore, 0)`, "todayHighScore")
      .from("(" + userScoresQB.getQuery() + ")", "us")
      .leftJoin(
        "(" + todayScoresQB.getQuery() + ")",
        "ts",
        "ts.username = us.username",
      )
      .groupBy("us.username");

    const topUsersQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("*")
      .from("(" + rankedUsersQB.getQuery() + ")", "ranked")
      .orderBy("ranked.totalHighScore", "DESC")
      .limit(5);

    const currentUserQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("*")
      .from("(" + rankedUsersQB.getQuery() + ")", "ranked")
      .where("ranked.username = ?");

    const finalQuery = `
      SELECT * FROM (${topUsersQB.getQuery()})
      UNION ALL
      SELECT * FROM (${currentUserQB.getQuery()})
    `;

    return await this.databaseService.dataSource.query(finalQuery, [
      today,
      today,
      username,
    ]);
  }
}
