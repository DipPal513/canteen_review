import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  canteenName: string;
  itemName: string;
  rating: number;
  comment?: string;
  mealTime: "Breakfast" | "Snacks" | "Dinner" | "Lunch" | "Other";
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    canteenName: {
      type: String,
      required: [true, "Canteen name is required"],
      trim: true, // Removes extra spaces
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    rating: {
      type: String,
      required: [true, "Rating is required"],
    },
    comment: {
      type: String,
      trim: true,
    },
    mealTime: {
      type: String,
      required: [true, "Meal time is required"],
      enum: {
        values: ["Breakfast", "Snacks", "Dinner", "Lunch", "Other"],
        message:
          "Meal time must be one of Breakfast, Snacks, Dinner, Lunch, or Other",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
