import { ResponseDto } from "@/dto/response.dto";

export type PublicGetUserPublicInfoResponseDto = ResponseDto<{
  username: string;
  gender: string;
  picture: string | null;
  highScore: number;
  rank: number;
}>;
