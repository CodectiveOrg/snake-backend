import { TokenPayload } from "../types/token-payload";
import { User } from "../entities/user";

export type ResponseDto<TResult = void> = {
  statusCode: number;
  message: string | string[];
} & (
  | (TResult extends void ? { result?: undefined } : { result: TResult })
  | { error: string }
);

export type AuthSignUpResponseDto = ResponseDto;
export type AuthSignInResponseDto = ResponseDto;
export type AuthSignOutResponseDto = ResponseDto;
export type AuthVerifyResponseDto = ResponseDto<TokenPayload>;

export type ProfileGetResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;
export type ProfileEditResponseDto = ResponseDto;
export type ProfileEditPictureResponseDto = ResponseDto;

export type CreateHistoryResponseDto = ResponseDto;
export type GetLeaderboardResponseDto = ResponseDto<
  { username: string; rank: number }[]
>;
export type GetUserRankResponseDto = ResponseDto<{
  username: string;
  rank: number;
  highScore: number;
}>;
export type GetHighScoreResponseDto = ResponseDto<{ highScore: number }>;
export type GetUserPublicInfoResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;
export type GetUserHistoryResponseDto = ResponseDto<
  { score: number; createdAt: Date }[]
>;

export type SettingsGetResponseDto = ResponseDto;
