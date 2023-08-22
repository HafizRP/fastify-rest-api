import { z } from "zod"

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    SECRET_KEY: z.string(),
    APP_PORT: z.string()
})

export type EnvSchema = z.infer<typeof envSchema>

export const Env = envSchema.parse(process.env)
