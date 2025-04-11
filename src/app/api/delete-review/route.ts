import { connectDB } from "@/src/db/connection";
import Review from "@/src/models/reviews.model";
import User from "@/src/models/user.model";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const  id  = searchParams.get("id");
    const match =await Review.findById(id);
    console.log("ismatch: ", match);
    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }
    const deleted = await Review.findByIdAndDelete(id); // Assume the review was deleted successfully
    if (deleted) {
      const user = await User.findById(deleted.userId); // Assuming `userId` is a field in the review model
      if (user) {
      user.reviews = user.reviews.filter((reviewId: string) => reviewId !== id);
      await user.save();
      }
    }

    if (deleted) {
      return NextResponse.json(
        { message: "Review deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete review" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("this is the error",error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
