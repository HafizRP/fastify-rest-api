import { FastifyInstance } from "fastify";
import {
  deleteUserHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { userRef } from "./user.schema";
import { $ref, ApiErrorsSchema } from "../../common/schema/error.schema";



async function userRoutes(server: FastifyInstance) {
  server.get('/login/google/callback', { schema: { hide: true } }, async (request, reply) => {
    try {
      const googlaOauth2 = await server.googleOauth2.getAccessTokenFromAuthorizationCodeFlow(request)
      return { access_token: googlaOauth2.token.access_token }
    } catch (error) {
      throw error
    }
  })

  server.get('/login/github/callback', { schema: { hide: true } }, async (request, reply) => {
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
        body: userRef("createUserSchema"),
        response: { 201: userRef("createUserResponseSchema"), 400: $ref('UnauthorizedErrorSchema') },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        tags: ["User Routes"],
        body: userRef("loginSchema"),
        response: { 200: userRef('loginResponseSchema'), ...ApiErrorsSchema }
      },
    },
    loginHandler
  );

  server.delete(
    "/:userId",
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ["User Routes"],
        security: [{ Authorization: [] }],
        // headers: {
        //   type: "object",
        //   properties: {
        //     "Authorization": {
        //       type: "string"
        //     }
        //   }
        // },
        params: userRef('deleteUserSchema')
      },
    },
    deleteUserHandler
  );
}

export default userRoutes;
