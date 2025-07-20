import { User } from "../entities/user";
import { ResponseDto } from "./response.dto";

export type PublicGetLeaderboardResponseDto = ResponseDto<
  { username: string; rank: number }[]
>;

export type PublicGetUserPublicInfoResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;
