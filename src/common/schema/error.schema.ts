import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const BaseErrorSchema = {
  code: z.string(),
  error: z.string(),
  message: z.string(),
}

const RequestErrorSchema = z.object({ ...BaseErrorSchema, statusCode: z.number().default(400) }).describe('REQUEST_ERROR')

const UnauthorizedErrorSchema = z.object({ ...BaseErrorSchema, statusCode: z.number().default(403) }).describe('UNAUTHORIZED_ERROR')

const NotFoundErrorSchema = z.object({ ...BaseErrorSchema, statusCode: z.number().default(404) }).describe("NOT_FOUND_ERROR")

const ServerErrorSchema = z.object({ ...BaseErrorSchema, statusCode: z.number().default(500) }).describe('SERVER_ERROR')

export const { schemas: errorSchema, $ref } = buildJsonSchemas({
  UnauthorizedErrorSchema,
  RequestErrorSchema,
  ServerErrorSchema,
  NotFoundErrorSchema
},
  {
    $id: "errorSchema"
  }
)

export const ApiErrorsSchema = {
  400: $ref('RequestErrorSchema'),
  401: $ref('UnauthorizedErrorSchema'),
  404: $ref("NotFoundErrorSchema"),
  500: $ref('ServerErrorSchema')
}