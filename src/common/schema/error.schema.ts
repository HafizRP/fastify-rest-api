import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const BaseErrorSchema = {
  statusCode: z.number(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
}

const RequestErrorSchema = z.object({ ...BaseErrorSchema }).describe('REQUEST_ERROR')

const UnauthorizedErrorSchema = z.object({ ...BaseErrorSchema }).describe('UNAUTHORIZED_ERROR')

const ServerErrorSchema = z.object({ ...BaseErrorSchema }).describe('SERVER_ERROR')

export const { schemas: errorSchema, $ref } = buildJsonSchemas({
  UnauthorizedErrorSchema,
  RequestErrorSchema,
  ServerErrorSchema
},
  {
    $id: "errorSchema"
  }
)

export const ApiErrorsSchema = {
  400: $ref('RequestErrorSchema'),
  401: $ref('UnauthorizedErrorSchema'),
  500: $ref('ServerErrorSchema')
}