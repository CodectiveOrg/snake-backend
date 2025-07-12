import { Response, Request } from "express";

export const SignOutEndpoint = (res: Response, req: Request) => {
  res.clearCookie(process.env.TOKEN_KE!);
  res.send("sign Out succcessfully ");
};
