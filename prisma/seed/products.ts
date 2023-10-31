import { PrismaClient } from "@prisma/client";
import products from '../../users.json'

export async function productsSeeder(prisma: PrismaClient) {
    await prisma.product.createMany({
        data: products
    })
}