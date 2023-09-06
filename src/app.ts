import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import foauth from "@fastify/oauth2";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { Env } from "./common/schema/app.schema";
import fcookie from "@fastify/cookie";
import productRoutes from "./modules/product/product.route";
import AMQServer from "./utils/amqlib";

const server = Fastify();

server.get("/healthcheck", (request, reply) => {
  return { status: "OK" };
});

server.get("/publish", async (request, reply) => {
  const connection = await AMQServer();
  connection.sendToQueue(
    "test-channel",
    Buffer.from("Hello This is from fastify-rest-api")
  );

  await connection.close();

  reply.send({ message: "Message send" });
});

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

server.register(fjwt, {
  secret: Env.SECRET_KEY,
});

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(swagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description: "API for alls",
        version: "1.0.0",
      },
    },
  });

  server.register(swaggerUI, {
    routePrefix: "/docs",
    staticCSP: true,
  });

  server.register(userRoutes, {
    prefix: "api/users",
  });

  server.register(productRoutes, {
    prefix: "api/products",
  });

  server.register(fcookie);

  server.register(foauth, {
    name: "googleOauth2",
    credentials: {
      client: {
        id: Env.GOOGLE_CLIENT_ID,
        secret: Env.GOOGLE_SECRET,
      },
      auth: foauth.GOOGLE_CONFIGURATION,
    },
    scope: ["profile"],
    startRedirectPath: "/api/users/login/google",
    callbackUri: "http://localhost:3000/api/users/login/google/callback",
  });

  server.get("/home", (request, reply) => {
    reply.header("Content-Type", "text/html");
    reply.send("<a href='/api/users/login/google'>Login With Google</a>");
  });

  return server;
}
