import { DatabaseService } from "@/services/database.service";

export class LeaderboardService {
  public constructor(private databaseService: DatabaseService) {}

  public async getLeaderboard(username: string): Promise<unknown> {
    const today = new Date().toISOString().split("T")[0];

    const userScoresQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("u.username", "username")
      .addSelect("u.picture", "picture")
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
      .addSelect("us.picture", "picture")
      .addSelect("MAX(us.score)", "totalHighScore")
      .addSelect(`COALESCE(ts.todayHighScore, 0)`, "todayHighScore")
      .addSelect("ROW_NUMBER() OVER (ORDER BY MAX(us.score) DESC)", "rank")
      .from("(" + userScoresQB.getQuery() + ")", "us")
      .leftJoin(
        "(" + todayScoresQB.getQuery() + ")",
        "ts",
        "ts.username = us.username",
      )
      .groupBy("us.username")
      .orderBy("totalHighScore", "DESC");

    const currentUserQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("*")
      .from("(" + rankedUsersQB.getQuery() + ")", "ranked")
      .where("ranked.username LIKE ?");

    const topUsersQB = this.databaseService.dataSource
      .createQueryBuilder()
      .select("*")
      .from("(" + rankedUsersQB.getQuery() + ")", "ranked")
      .limit(5);

    const finalQuery = `
      SELECT * FROM (${currentUserQB.getQuery()})
      UNION ALL
      SELECT * FROM (${topUsersQB.getQuery()})
    `;

    return await this.databaseService.dataSource.query(finalQuery, [
      today,
      username,
      today,
    ]);
  }
}
