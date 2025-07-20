import { ResponseDto } from "@/dto/response.dto";

import { User } from "@/entities/user";

export type PublicGetLeaderboardResponseDto = ResponseDto<
  { username: string; highScore: number }[]
>;

export type PublicGetUserPublicInfoResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;
