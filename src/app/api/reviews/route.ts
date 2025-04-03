// Removed unused mongoose import
import { NextResponse } from "next/server";
import Review from "@/src/models/reviews.model"; // Assuming the Review model is exported from this path
import { connectDB } from "@/src/db/connection";

export async function GET(request: Request) {
  try {
    connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("user", null, null, { strictPopulate: false })
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments();

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
