import { DatabaseService } from "../src/services/database.service";
import { History } from "../src/entities/history";
import { Setting } from "../src/entities/setting";

let databaseService: DatabaseService;

async function createHistory(body: {
  username: string;
  score: number;
}): Promise<void> {
  const repo = databaseService.dataSource.getRepository(History);

  const history = new History();
  history.username = body.username;
  history.score = body.score;

  await repo.save(history);
}

async function createSetting(body: {
  username: string;
  sfx: number;
  music: number;
}): Promise<void> {
  const repo = databaseService.dataSource.getRepository(Setting);
  const setting = new Setting();
  setting.username = body.username;
  setting.sfx = body.sfx;
  setting.music = body.music;

  await repo.save(setting);
}

async function seed(): Promise<void> {
  await Promise.allSettled([
    createHistory({ username: "BijanProgrammer", score: 23 }),
    createHistory({ username: "Ali", score: 108 }),
    createHistory({ username: "BijanProgrammer", score: 16 }),
    createHistory({ username: "Reza", score: 42 }),
    createHistory({ username: "Ali", score: 8 }),
    createHistory({ username: "BijanProgrammer", score: 4 }),
    createHistory({ username: "Mahdi", score: 815 }),

    createSetting({ username: "BijanProgrammer", sfx: 1, music: 9 }),
  ]);
}

async function main(): Promise<void> {
  databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  await seed();
}

main().then();
