import { DatabaseService } from "../src/services/database.service";
import { History } from "../src/entities/history";
import { Settings } from "../src/entities/settings";

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

async function createSettings(body: {
  username: string;
  sfx: number;
  music: number;
}): Promise<void> {
  const repo = databaseService.dataSource.getRepository(Settings);
  const settings = new Settings();
  settings.username = body.username;
  settings.sfx = body.sfx;
  settings.music = body.music;

  await repo.save(settings);
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

    createSettings({ username: "BijanProgrammer", sfx: 1, music: 9 }),
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
