import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";
import { CreateProductInput, FilterProductInput, GetProductInput } from "./product.schema";
import { createProduct, getProduct } from "./product.service";
import { SocketStream } from "@fastify/websocket";
import { RedisServer } from "../../utils/redis";

export async function createProductHandler(request: FastifyRequest<{ Body: CreateProductInput }>, reply: FastifyReply) {
  try {
    const product = await createProduct(request.body);
    const redis = await RedisServer()

    await redis.publish(`new-products`, `New Product ID:${product.id}`)

    return reply.code(201).send(product)
  } catch (error) {
    throw error;
  }
}


export async function getProductHandler(request: FastifyRequest<{ Params: GetProductInput }>, reply: FastifyReply) {
  try {
    const { product_id } = request.params
    const redis = await RedisServer()

    const key = `product:${product_id}`

    const cache = await redis.get(key)

    if (cache) {
      return JSON.parse(cache)
    }

    const product = await getProduct(product_id)
    await redis.setex(key, 60 * 2, JSON.stringify(product))

    return product
  } catch (error) {
    throw error
  }
}

export async function getProductsHandler() {
  return prisma.product.findMany()
}

export async function getProductsLive(connection: SocketStream, request: FastifyRequest) {
  let getProducts = setInterval(async () => {
    const products = await prisma.product.findMany()
    connection.socket.send(JSON.stringify(products))
    console.log("GET")
  }, 1000)

  connection.socket.on("message", async (data) => {
    clearInterval(getProducts)

    const message: FilterProductInput = JSON.parse(data.toString())

    if (message.title === undefined) {
      connection.socket.send(JSON.stringify({ statusCode: 400, message: "Invalid title" }))
    }


    getProducts = setInterval(async () => {
      const products = await prisma.product.findMany({ where: { title: { contains: message.title } } })
      connection.socket.send(JSON.stringify(products))
    }, 1000)
  })

  connection.socket.on("close", () => {
    clearInterval(getProducts)
  })
}

export async function chatProductOwner(connection: SocketStream, request: FastifyRequest<{ Params: { chat_id: number } }>) {
  const { chat_id } = request.params

  const user = request.user

  connection.socket.on("message", data => {
    const message = data.toString()
    const payload = {
      chat_id,
      message,
      from: user.name
    }

    for (const client of request.server.websocketServer.clients) {
      client.send(JSON.stringify(payload))
    }
  })
}