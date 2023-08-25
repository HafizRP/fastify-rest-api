import { JWT } from "@fastify/jwt";
import { OAuth2Namespace } from '@fastify/oauth2'

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  export interface FastifyInstance {
    authenticate: any;
    googleOauth2: OAuth2Namespace
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
}