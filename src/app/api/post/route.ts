import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/src/db/connection";
import Review from "@/src/models/reviews.model";

// Validation Schema using Zod
const reviewSchema = z.object({
    userId: z.string().nonempty("User id is required"),
    canteenName: z.string().nonempty("Name is required"),
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
    itemName: z.string().min(5, "Item Name must be at least 5 characters"),
    mealTime: z.enum(["Breakfast", "Lunch", "Dinner", "Snack","others"]),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const singleReview = await req.json();
    console.log("this is the body: ", singleReview)
    // Validate request body
   

    // Save review to database
    const newReview = new Review(singleReview);

    await newReview.save();

    return NextResponse.json(
      {
        message: "Review added successfully",
        success: true,
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("this is the global error: ", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
