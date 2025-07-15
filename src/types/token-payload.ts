import { User } from "../entities/user";

export type TokenPayload = Pick<User, "username" | "email">;
