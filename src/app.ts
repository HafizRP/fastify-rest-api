import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import userRoutes from "./modules/user/user.route";
import fview from "@fastify/view";
import hbs from "handlebars";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import path from "path";

export const server = Fastify();

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  export interface FastifyInstance {
    authenticate: any;
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

server.register(fview, {
  engine: {
    handlebars: hbs,
  },
  root: path.resolve(__dirname, "./views"),
  includeViewExtension: true,
});

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

  server.get("/home", (request: FastifyRequest, reply: FastifyReply) => {
    return reply.view("index", { data: "Hello" });
  });

  try {
    await server.listen({ port: 3000 });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
