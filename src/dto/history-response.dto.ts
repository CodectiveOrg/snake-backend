import { ResponseDto } from "@/dto/response.dto";

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
export type HistoryGetLeaderboardResponseDto = ResponseDto<
  {
    username: string;
    todayHighScore: number;
    totalHighScore: number;
    rank: number;
  }[]
>;
