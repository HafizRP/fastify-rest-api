import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/crypto";

export async function userSeeder(prisma: PrismaClient) {
    const users = [
        {
            email: "user@gmail.com",
            password: "user12345",
            roleId: 2
        },
        {
            email: "admin@gmail.com",
            password: "admin12345",
            roleId: 1
        },
        {
            email: "superadmin@gmail.com",
            password: "superadmin12345",
            roleId: 3
        }
    ]


    for (const { email, password, roleId } of users) {
        const { hash, salt } = hashPassword(password)
        await prisma.user.create({
            data: {
                email,
                password: hash,
                salt,
                roleId
            }
        })
    }
}