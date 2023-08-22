import { z } from "zod"

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"])
})

export type EnvSchema = z.infer<typeof envSchema>

export const Env = envSchema.parse(process.env)
