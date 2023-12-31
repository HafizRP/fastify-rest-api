import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

const envSchema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    SECRET_KEY: z.string(),
    APP_PORT: z.preprocess((a) => parseInt(a as string, 10), z.number()),
    AMQ_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_SECRET: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    CLIENT_SECRET_KEY: z.string()
})

const healthCheckSchema = z.object({
    status: z.string()
})


const jwtSchema = z.object({ id: z.number(), name: z.string(), email: z.string() })

type JwtPayload = { iat: number, exp: number }

export type JwtSchema = z.infer<typeof jwtSchema> & JwtPayload

export const Env = envSchema.parse(process.env)

export const { $ref: appRef, schemas: appSchemas } = buildJsonSchemas({ healthCheckSchema }, { $id: 'appSchema' })
