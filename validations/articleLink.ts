import { z } from "zod";

export const articleLinkValidator = z.object({
  header: z.string(),
  link: z.string(),
});
