import { z } from "zod/index";

export const VolumeSchema = z.number().min(0).max(10);
