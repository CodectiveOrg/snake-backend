import { DatabaseService } from "../src/services/database.service";
import { History } from "../src/entities/history";
import { User } from "../src/entities/user";
import { hashPassword } from "../src/utils/auth.utils";
import { Repository } from "typeorm";

let databaseService: DatabaseService;
let historyRepo: Repository<History>;
let userRepo: Repository<User>;

async function createUser(user: Omit<User, "id" | "histories">): Promise<void> {
  const repo = databaseService.dataSource.getRepository(User);

  const hashedPassword = await hashPassword(user.password);
  await repo.save({ ...user, password: hashedPassword });
}

async function createHistory(
  username: string,
  history: Omit<History, "id" | "user">,
): Promise<void> {
  const user = await userRepo.findOne({ where: { username } });

  if (!user) {
    console.warn(`Username "${username}" not found.`);
    return;
  }

  await historyRepo.save({ ...history, user });
}

async function seed(): Promise<void> {
  await Promise.allSettled(users.map(createUser));

  await Promise.allSettled([
    createHistory(users[0].username, { score: 23 }),
    createHistory(users[1].username, { score: 108 }),
    createHistory(users[0].username, { score: 16 }),
    createHistory(users[2].username, { score: 42 }),
    createHistory(users[1].username, { score: 8 }),
    createHistory(users[0].username, { score: 4 }),
    createHistory(users[3].username, { score: 815 }),
  ]);
}

async function main(): Promise<void> {
  databaseService = new DatabaseService();
  const isDatabaseInitialized = await databaseService.init();

  if (!isDatabaseInitialized) {
    return;
  }

  historyRepo = databaseService.dataSource.getRepository(History);
  userRepo = databaseService.dataSource.getRepository(User);

  await seed();
}

main().then();

const users: Omit<User, "id" | "histories">[] = [
  {
    username: "BijanProgrammer",
    email: "bijanprogrammer@gmail.com",
    password: "1234",
  },
  {
    username: "Ali",
    email: "ali@gmail.com",
    password: "1234",
  },
  {
    username: "Reza",
    email: "reza@gmail.com",
    password: "1234",
  },
  {
    username: "Mahdi",
    email: "mahdi@gmail.com",
    password: "1234",
  },
];
