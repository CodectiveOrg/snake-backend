import { ResponseDto } from "@/dto/response.dto";

import { User } from "@/entities/user";

export type ProfileGetResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;

export type ProfileEditResponseDto = ResponseDto;

export type ProfileEditPictureResponseDto = ResponseDto;
