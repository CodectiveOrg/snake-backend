import { User } from "@/entities/user";

export const USERS: Omit<User, "id" | "histories">[] = [
  {
    username: "BijanProgrammer",
    email: "bijan@gmail.com",
    password: "1234",
  },
  {
    username: "ZahraZare",
    email: "zahrazare@gmail.com",
    password: "1234",
  },
  {
    username: "mazaherireza",
    email: "mazaherireza@gmail.com",
    password: "1234",
  },
  {
    username: "Ali.M",
    email: "mohammad.ali@gmail.com",
    password: "1234",
  },
] as const;
