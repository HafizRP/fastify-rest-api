import Fastify from "fastify";
import FastifyAppAuth from "./application/auth";
import FastifyAppSwagger from "./application/swagger";
import FastifyAppRoute from "./application/route";

const server = Fastify()

async function main() {
  await server
    .register(FastifyAppSwagger)
    .register(FastifyAppAuth)
    .register(FastifyAppRoute);
  return server;
}

export default main;
