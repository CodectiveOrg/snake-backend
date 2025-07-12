import { Response, Request } from "express"
import { readUser } from "../../database/user.table"
import { UserModel } from "../../models/user.model"
import { comparePassword, generateToken } from "../../utils/auth.utils"

export const SignInEndpoint = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user: UserModel | undefined = readUser(username)
  if (!user) {
    res.status(401).json({ error: 'username or password is incorrent' })
    return
  }
  const isPasswordCorrect = await comparePassword(password, user.password)
  if (!isPasswordCorrect) {
    res.status(401).json({ error: 'username or password is incorrent' })
    return
  }
  generateToken(res, { username })
  res.json({ message: "sign in  succes" })
}