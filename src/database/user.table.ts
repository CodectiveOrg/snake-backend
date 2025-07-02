import { UserModel } from "../models/user.model";
const users: UserModel[] = [
    {
        username: 'ali',
        password: "1234"
    }
]
export const creatUser = (user: UserModel): void => {
    users.push(user)
}
export const readUser = (username: string): UserModel | undefined => {
    return users.find((user) => user.username === username)
}