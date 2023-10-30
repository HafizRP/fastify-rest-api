import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/crypto";

export async function userSeeder(prisma: PrismaClient) {
    const users = [
        {
            email: "user@gmail.com",
            name: "user",
            password: "user12345",
            roleId: 2
        },
        {
            email: "admin@gmail.com",
            name: "admin",
            password: "admin12345",
            roleId: 1
        },
        {
            email: "superadmin@gmail.com",
            name: "superadmin",
            password: "superadmin12345",
            roleId: 3
        }
    ]


    for (const { email, password, roleId, name } of users) {
        const { hash, salt } = hashPassword(password)
        await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                salt,
                roleId
            }
        })
    }
}