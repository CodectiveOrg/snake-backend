import { TokenPayload } from "../types/token-payload";

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
