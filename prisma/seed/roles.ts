import { PrismaClient } from "@prisma/client";

export async function rolesSeeder(prisma: PrismaClient) {
    await prisma.roles.createMany({
        data: [
            {
                name: "admin"
            },
            {
                name: "user"
            },
            {
                name: "super_admin"
            }
        ]
    })
}