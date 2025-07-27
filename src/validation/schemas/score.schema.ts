import { z } from "zod";

export const ScoreScheme = z.number().nonnegative();
