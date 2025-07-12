import { UserModel } from "./user.model";

export type passwordLessModel = Omit<UserModel, "password">;
