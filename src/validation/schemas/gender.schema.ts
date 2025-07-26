import { z } from "zod/index";

export const GenderSchema = z.enum(["male", "female"]);
