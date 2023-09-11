import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const UnauthorizedErrorSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
}).describe('UNAUTHORIZED_ERROR')



export const { schemas: errorSchema, $ref } = buildJsonSchemas({
  UnauthorizedErrorSchema
}, {
  $id: "errorSchema"
})

export const ApiErrorsSchema = {
  400: $ref('UnauthorizedErrorSchema'),
  404: $ref('UnauthorizedErrorSchema')
}