import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";

const server = Fastify();

server.get("/healthcheck", (request, reply) => {
  return { status: "OK" };
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
  secret: "sadlskndalskdaslkdasldn",
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


  return server
}

export default main