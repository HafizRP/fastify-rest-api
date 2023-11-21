import Redis from "ioredis"

const redis = new Redis()

export async function RedisServer() {
    await redis.connect()
    return redis
}