import { NextResponse } from "next/server"
import Review from "@/src/models/reviews.model"
import { connectDB } from "@/src/db/connection"
import { getRedisClient } from "@/src/lib/redis"


export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const skip = (page - 1) * limit

    // Generate a unique cache key based on page and limit
    const cacheKey = `reviews:page=${page}:limit=${limit}`

    // Get Redis client
    const redis = getRedisClient()

    try {
      // Try to get cached data
      const cachedData = await redis.get(cacheKey)

      if (cachedData) {
        // If cached data exists, return it
        return NextResponse.json(JSON.parse(cachedData))
      }
    } catch (redisError) {
      // Log Redis error but continue with database query
      console.error("Redis cache error:", redisError)
      // We'll continue with the database query
    }

    // Fetch data from the database if not cached or if Redis failed
    const reviews = await Review.find()
      .populate("user", "_id name department email hall", null, { strictPopulate: false })
      .skip(skip)
      .limit(limit)
    const total = await Review.countDocuments()

    const responseData = {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }

    // Try to cache the response data
    try {
      if (redis) {
        await redis.set(cacheKey, JSON.stringify(responseData), "EX", 60)
      }
    } catch (redisCacheError) {
      // Log error but don't fail the request
      console.error("Failed to cache data:", redisCacheError)
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
