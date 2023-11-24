import { PrismaClient } from "@prisma/client";
import products from './data/products.json'

export async function productsSeeder(prisma: PrismaClient) {
    await prisma.product.createMany({
        data: products
    })
}