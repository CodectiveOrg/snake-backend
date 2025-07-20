import { User } from "../entities/user";
import { ResponseDto } from "./response.dto";

export type ProfileGetResponseDto = ResponseDto<
  Pick<User, "username" | "email" | "picture">
>;

export type ProfileEditResponseDto = ResponseDto;

export type ProfileEditPictureResponseDto = ResponseDto;
