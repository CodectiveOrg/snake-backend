
import { Response, Request } from "express"
import { creatUser, readUser } from "../../database/user.table"
import { UserModel } from "../../models/user.model"
import { generateToken, hashPassword } from "../../utils/auth.utils"

export const SignUPEndpoint = async (res: Response, req: Request) => {
  const { username, password } = req.body
  const user: UserModel | undefined = readUser(username)
  if (user) {
    res.status(400).json({ error: 'usernam IS ALREADY TOKEN' })
    return
  }
  const hashedPassword = await hashPassword(password)
  creatUser({ username, password: hashedPassword })
  generateToken(res, { username })
  res.json({ message: "sign up  succes" })
}