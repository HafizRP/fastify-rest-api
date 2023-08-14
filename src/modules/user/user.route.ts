import { FastifyZodInstance } from "fastify-zod/build/FastifyZod";
import { FastifyInstance } from "fastify";
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        tags: ["User Endpoints"],
        body: $ref("createUserSchema"),
        response: { 201: $ref("createUserResponseSchema") },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        tags: ["User Endpoints"],
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get("/", { preHandler: [server.authenticate] }, getUsersHandler);
}

export default userRoutes;
