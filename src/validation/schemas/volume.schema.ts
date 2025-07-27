import { z } from "zod";

export const VolumeSchema = z.number().min(0).max(10);
