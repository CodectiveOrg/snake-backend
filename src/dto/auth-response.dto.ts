import { ResponseDto } from "@/dto/response.dto";

import { TokenPayload } from "@/types/token-payload";

export type AuthSignUpResponseDto = ResponseDto;

export type AuthSignInResponseDto = ResponseDto;

export type AuthSignOutResponseDto = ResponseDto;

export type AuthVerifyResponseDto = ResponseDto<TokenPayload>;
