import { Prisma, Product } from "@prisma/client";
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

  const sql = Prisma.sql`select title, content, price from Product WHERE id = ?`

  const product = await prisma.$queryRaw<Pick<Product, 'title' | 'content' | 'price'>>(sql, [product_id]);

  console.log(product)


  return product
}

export function getProducts() {
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
