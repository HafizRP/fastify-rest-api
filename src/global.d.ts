import { JWT } from "@fastify/jwt";
import { OAuth2Namespace } from '@fastify/oauth2'
import { JwtSchema } from "./common/schema/app.schema";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  export interface FastifyInstance {
    authenticate: any;
    googleOauth2: OAuth2Namespace
    githubOauth2: OAuth2Namespace
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JwtSchema
  }
}