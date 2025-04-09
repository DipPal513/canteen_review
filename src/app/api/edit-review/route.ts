import { connectDB } from "@/src/db/connection";
import Review from "@/src/models/reviews.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { id, updatedReview } = await req.json();

    if (!id || !updatedReview) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDB();
    // Replace this with your actual database logic

    const updated = await Review.findByIdAndUpdate(id, updatedReview);

    return NextResponse.json({
      message: "Review updated successfully",
      updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
