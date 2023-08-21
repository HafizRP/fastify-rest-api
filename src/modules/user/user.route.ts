import { FastifyZodInstance } from "fastify-zod/build/FastifyZod";
import { FastifyInstance } from "fastify";
import {
  deleteUserHandler,
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
        tags: ["User Routes"],
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
        tags: ["User Routes"],

        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  // server.get("/", { preHandler: [server.authenticate] }, getUsersHandler);


  server.delete('/:email', { preHandler: [server.authenticate] }, deleteUserHandler)
}

export default userRoutes;
