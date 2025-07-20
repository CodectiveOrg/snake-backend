import { TokenPayload } from "../types/token-payload";
import { ResponseDto } from "./response.dto";

export type AuthSignUpResponseDto = ResponseDto;

export type AuthSignInResponseDto = ResponseDto;

export type AuthSignOutResponseDto = ResponseDto;

export type AuthVerifyResponseDto = ResponseDto<TokenPayload>;
