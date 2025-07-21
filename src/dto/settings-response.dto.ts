import { ResponseDto } from "@/dto/response.dto";

export type SettingsEditResponseDto = ResponseDto;

export type SettingsGetResponseDto = ResponseDto<{
  music: number;
  sfx: number;
}>;
