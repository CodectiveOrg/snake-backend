import { z } from "zod";

export const createHistorySchema = z.object({
  username: z.string().min(1, "Username is required"),
  score: z.number({
    invalid_type_error: "Score must be a number",
  }),
});
