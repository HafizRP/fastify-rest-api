import dotenv from 'dotenv'

dotenv.config({
    path: process.env.NODE_ENV == "test" ? '.env.test' : ".env"
})

// console.log(`Current Environtmen : ${process.env.NODE_ENV}`)

// console.log(`Current DB URL : ${process.env.DATABASE_URL}`)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        }
    }
});

export default prisma;
