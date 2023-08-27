import { z } from "zod";

const UnauthorizedErrorSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
});
