import { User } from "../../src/entities/user";

export const USERS: Omit<User, "id" | "histories">[] = [
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
] as const;
