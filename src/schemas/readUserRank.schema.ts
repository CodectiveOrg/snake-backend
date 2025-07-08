import z from "zod";

export const readUserRankSchema = z.object({
  username: z.string().min(1, "Username is required"),
});
