import { Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { passwordLessModel } from "../models/passwordless";

export const generateToken = (res: Response, user: passwordLessModel): void => {
    const payload = {
        user
    };
    const token: string = jwt.sign(payload, process.env.TOKEN_SECRE!, { expiresIn: '3d  ' })
    res.cookie('token', token, {
        secure: true,
        httpOnly: true,
        maxAge: 3 * 24 * 3600 * 1000,
    })
}
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt)
}
export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashed)
}