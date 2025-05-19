
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/src/db/connection";
import Review from "@/src/models/reviews.model";
import User from "@/src/models/user.model";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: "dioqkynk3",
  api_key: "572299971542565",
  api_secret: "gGJnPrzrtkG5xWoKzgbddQmWoiM",
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const singleReview = await req.json();
    console.log(singleReview);
    // Manual validation instead of relying on zod
    const validationErrors = validateReview(singleReview);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors },
        { status: 400 }
      );
    }

    let imageUrl = null;
console.log(singleReview);
    // Check if an image is provided
    if (singleReview.image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(singleReview.image, {
          folder: "reviews",
          resource_type: "image",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 400 }
        );
      }
    }

    // Save review to database
    const newReview = new Review({
      user: singleReview.user,
      canteenName: singleReview.canteenName,
      rating: singleReview.rating,
      comment: singleReview.comment,
      itemName: singleReview.itemName,
      mealTime: singleReview.mealTime,
      image: imageUrl, // Save the image URL if uploaded
    });

    // Update user's reviews array
    await User.findByIdAndUpdate(singleReview.user, { 
      $push: { reviews: newReview._id } 
    });

    await newReview.save();

    return NextResponse.json(
      {
        message: "Review added successfully",
        success: true,
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Manual validation function to replace zod
interface ReviewInput {
  user: string;
  canteenName: string;
  rating: number;
  comment: string;
  itemName: string;
  mealTime: string;
  image: string;
}

function validateReview(review: ReviewInput): string[] {
  const errors: string[] = [];
  
  if (!review.user) errors.push("User id is required");
  if (!review.image) errors.push("Image is required");
  if (!review.canteenName) errors.push("Name is required");
  
  if (typeof review.rating !== 'number') {
    errors.push("Rating must be a number");
  } else if (review.rating < 1 || review.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }
  
  if (!review.comment || review.comment.length < 5) {
    errors.push("Comment must be at least 5 characters");
  }
  
  if (!review.itemName || review.itemName.length < 5) {
    errors.push("Item Name must be at least 5 characters");
  }
  
  const validMealTimes = ["Breakfast", "Lunch", "Dinner", "Snack", "others"];
  if (!validMealTimes.includes(review.mealTime)) {
    errors.push("Invalid meal time");
  }
  
  return errors;
}