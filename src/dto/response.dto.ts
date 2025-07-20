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

export type HistoryCreateHistoryResponseDto = ResponseDto;
export type HistoryGetUserRankResponseDto = ResponseDto<{
  username: string;
  rank: number;
  highScore: number;
}>;
export type HistoryGetHighScoreResponseDto = ResponseDto<{ highScore: number }>;
export type HistoryGetUserHistoryResponseDto = ResponseDto<
  { score: number; createdAt: Date }[]
>;

export type ProfileGetResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;
export type ProfileEditResponseDto = ResponseDto;
export type ProfileEditPictureResponseDto = ResponseDto;

export type PublicGetLeaderboardResponseDto = ResponseDto<
  { username: string; rank: number }[]
>;
export type PublicGetUserPublicInfoResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;

export type SettingsGetResponseDto = ResponseDto;
