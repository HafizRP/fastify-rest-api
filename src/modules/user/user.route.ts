import { FastifyInstance } from "fastify";
import {
  deleteUserHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.get('/login/google/callback', async (request, reply) => {
    try {
      const googlaOauth2 = await server.googleOauth2.getAccessTokenFromAuthorizationCodeFlow(request)
      return { access_token: googlaOauth2.token.access_token }
    } catch (error) {
      throw error
    }
  })

  server.get('/login/github/callback', async (request, reply) => {
    try {
      const githubAcc = await server.githubOauth2.getAccessTokenFromAuthorizationCodeFlow(request)
      return githubAcc
    } catch (error) {
      throw error
    }
  })

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

  server.delete(
    "/:email",
    {
      preHandler: [server.authenticate],
      schema: { tags: ["User Routes"], params: $ref("deleteUserSchema") },
    },
    deleteUserHandler
  );
}

export default userRoutes;
