import { z } from "zod";

export const UsernameSchema = z.string().min(3).max(16);

export const EmailSchema = z.string().email();

export const PasswordSchema = z
  .string()
  .min(6)
  .max(16)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
