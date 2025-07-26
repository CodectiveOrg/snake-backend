import { z } from "zod/index";

export const EmailSchema = z.string().email();
