export type ResponseDto<TResult = void> = {
  statusCode: number;
  message: string | string[];
} & (
  | (TResult extends void ? { result?: undefined } : { result: TResult })
  | { error: string }
);
