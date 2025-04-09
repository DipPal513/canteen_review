import Redis from "ioredis"

// Create a singleton Redis client
let redis: Redis | null = null

export function getRedisClient() {
  if (!redis) {
    // Use environment variables for Redis connection
    redis = new Redis({
      host: process.env.REDIS_HOST || "redis-15227.c11.us-east-1-3.ec2.redns.redis-cloud.com",
      port: Number.parseInt(process.env.REDIS_PORT || "15227"),
      password: process.env.REDIS_PASSWORD || "mXPTyNaU9gzRnZOK64cjppaztL5ymVeH",
      // Reconnect strategy for better reliability
      retryStrategy: (times) => {
        // Exponential backoff with max 2000ms delay
        return Math.min(times * 50, 2000)
      },
    })

    redis.on("error", (err) => {
      console.error("Redis connection error:", err)
      redis = null
    })
  }

  return redis
}
