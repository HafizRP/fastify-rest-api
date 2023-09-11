import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userSchema = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userSchema,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const createUserResponseSchema = z.object({ ...userSchema, id: z.number() });

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const loginResponseSchema = z.object({ accessToken: z.string() });

const deleteUserSchema = z.object({ userId: z.number() });

export type DeleteUserDTO = z.infer<typeof deleteUserSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref: userRef } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginResponseSchema,
    loginSchema,
    deleteUserSchema,
  },
  { $id: "userSchema" }
);
