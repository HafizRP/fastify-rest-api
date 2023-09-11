import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";
import { CreateProductInput, GetProductInput } from "./product.schema";
import { createProduct, getProduct } from "./product.service";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>,
  reply: FastifyReply
) {
  try {
    const product = await createProduct(request.body);
    return product;
  } catch (error) {
    throw error;
  }
}


export async function getProductHandler(request: FastifyRequest<{
  Params: GetProductInput
}>, reply: FastifyReply) {
  try {
    const product = await getProduct(request.params.product_id)
    return product
  } catch (error) {
    throw error
  }
}

export async function getProductsHandler() {
  return prisma.product.findMany();
}
