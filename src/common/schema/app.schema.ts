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
})

const jwtSchema = z.object({ id: z.number(), name: z.string(), email: z.string(), password: z.string() })

export type JwtSchema = z.infer<typeof jwtSchema>

export const Env = envSchema.parse(process.env)
