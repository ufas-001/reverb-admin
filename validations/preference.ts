import { z } from "zod";

export const preferenceValidator = z.object({
  backgroundColor: z.string(),
  textColor: z.string(),
  bannerColor: z.string(),
});
