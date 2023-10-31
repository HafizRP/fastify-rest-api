import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return prisma.product.create({
    data,
  });
}


export async function getProduct(product_id: number) {
  return prisma.product.findUniqueOrThrow({
    where: { id: product_id }
  })
}

export function getProductsWithOwner() {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}
