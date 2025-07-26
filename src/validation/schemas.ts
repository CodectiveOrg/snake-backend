import { z } from "zod";

export const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 6 characters long")
  .max(16, "Username must be a maximum of 16 characters long");

export const EmailSchema = z.string().email();

export const PasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(16, "Password must be a maximum of 16 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const GenderSchema = z.enum(["male", "female"]);

export const SettingsSchema = z.number().min(0).max(10);
