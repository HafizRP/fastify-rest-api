import Redis from "ioredis"

const redis = new Redis({ username: "tradersfamily", password: "tradersfamily" })

export async function RedisServer() {
    return redis
}