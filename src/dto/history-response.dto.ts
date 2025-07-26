import { ResponseDto } from "@/dto/response.dto";

export type HistoryCreateHistoryResponseDto = ResponseDto;

export type HistoryGetStatsResponseDto = ResponseDto<{
  username: string;
  picture: string | null;
  highScore: number;
  rank: number;
}>;

export type HistoryGetUserHistoryResponseDto = ResponseDto<
  { score: number; createdAt: Date }[]
>;
export type HistoryGetLeaderboardResponseDto = ResponseDto<
  {
    username: string;
    picture: string | null;
    todayHighScore: number;
    totalHighScore: number;
    rank: number;
  }[]
>;
