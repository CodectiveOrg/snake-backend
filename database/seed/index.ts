import { DatabaseService } from "../../src/services/database.service";
import { Seeder } from "./seeder";

async function main(): Promise<void> {
  const databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  const seeder = new Seeder(databaseService);
  await seeder.seed();
}

main().then();
