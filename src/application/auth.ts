import fastifyCookie from '@fastify/cookie'
import fastifyOauth2 from '@fastify/oauth2'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Env } from '../common/schema/app.schema'
import fastifyJwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

export default fp(async (server: FastifyInstance) => {
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  server.register(fastifyJwt, {
    secret: Env.SECRET_KEY,
  });
  await server.register(fastifyCookie)

  // Google OAuth
  await server.register(fastifyOauth2, {
    name: "googleOauth2",
    credentials: {
      client: {
        id: Env.GOOGLE_CLIENT_ID,
        secret: Env.GOOGLE_SECRET
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    scope: ["profile"],
    startRedirectPath: "/api/users/login/google",
    callbackUri: "http://localhost:3000/api/users/login/google/callback",
    tags: ["OAuth Authentication"],
  })

  // Github OAuth
  await server.register(fastifyOauth2, {
    name: "githubOauth2",
    credentials: {
      client: {
        id: Env.GITHUB_CLIENT_ID,
        secret: Env.GITHUB_SECRET
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION
    },
    startRedirectPath: "/api/users/login/github",
    callbackUri: "http://localhost:3000/api/users/login/github/callback",
    tags: ["OAuth Authentication"]
  })
})