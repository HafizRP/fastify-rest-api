import Fastify from "fastify";
import FastifyAppAuth from "./application/auth";
import FastifyAppSwagger from "./application/swagger";
import FastifyAppRoute from "./application/route";
import fastifyStatic from "@fastify/static";
import path from "path";
import fastifyWebsocket from "@fastify/websocket";

const server = Fastify()

async function main() {
  await server
    .register(FastifyAppSwagger)
    .register(FastifyAppAuth)
    .register(fastifyWebsocket)
    .register(FastifyAppRoute)
    .register(fastifyStatic, {
      root: path.resolve(__dirname, '../public'),
      prefix: "/public/",
    })
  return server;
}

export default main;
