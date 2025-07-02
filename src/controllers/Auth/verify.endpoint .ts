import { Response, Request } from "express"

export const VerifyEndpoint = async (res: Response, req: Request) => {
  const { user } = res.locals
  if (!user) {
    res.sendStatus(401)
    return
  }
  res.sendStatus(200)
}