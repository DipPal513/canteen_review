import { NextResponse } from "next/server"
import Review from "@/src/models/reviews.model"
import { connectDB } from "@/src/db/connection"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const skip = (page - 1) * limit

    // Fetch data from the database
    const reviews = await Review.find()
      .populate("user", "_id name department email hall", null,null, { strictPopulate: false })
      .skip(skip)
      .limit(limit)
    const total = await Review.countDocuments()
    console.log("reviews from the get-review: ", reviews);
    const responseData = {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
