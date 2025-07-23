import { User } from "@/entities/user";

export const USERS: Omit<User, "id" | "histories">[] = [
  {
    username: "BijanProgrammer",
    email: "bijan@gmail.com",
    password: "1234",
    gender: "male",
    picture: null,
  },
  {
    username: "ZahraZare",
    email: "zahrazare@gmail.com",
    password: "1234",
    gender: "female",
    picture: null,
  },
  {
    username: "mazaherireza",
    email: "mazaherireza@gmail.com",
    password: "1234",
    gender: "male",
    picture: null,
  },
  {
    username: "Ali.M",
    email: "mohammad.ali@gmail.com",
    password: "1234",
    gender: "male",
    picture: null,
  },
  {
    username: "Alireza",
    email: "alireza@gmail.com",
    password: "1234",
    gender: "male",
    picture: null,
  },
] as const;
