import { z } from "zod/index";

export const SettingsSchema = z.object({
  music: z.number().min(0).max(10),
  sfx: z.number().min(0).max(10),
});
