"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/src/context/AppContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Schema definition for review form validation
const reviewSchema = z.object({
  canteenName: z.string().min(1, "Canteen name is required"),
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string(),
  user: z.string(),

  itemName: z.string().min(2, "Item name must be at least 2 characters"),
  mealTime: z.enum(["Breakfast", "Lunch", "Dinner", "Snacks", "Other"]),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmitSuccess?: (data: ReviewFormValues) => void;
  initialData?: Partial<ReviewFormValues>;
  redirectPath?: string;
}

export default function ReviewForm({
  onSubmitSuccess,
  initialData = {},
  redirectPath = "/reviews",
}: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user: userData } = useAppContext();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      canteenName: initialData.canteenName || "",
      user: userData?._id,
      rating: initialData.rating || "",
      itemName: initialData.itemName || "",
      comment: initialData.comment || "",
      mealTime: initialData.mealTime || "Other",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    
    setIsLoading(true);

    
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted successfully!");

      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      } else {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Categories for the dropdown
  const categories = [
    "North Indian",
    "South Indian",
    "Chinese",
    "Fast Food",
    "Beverages",
    "Desserts",
    "Other",
  ];

  // Meal times for the dropdown
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks", "Other"];

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle>New Review</CardTitle>
        <CardDescription>
          Fill out the form below to add your review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="canteenName">Canteen Name</Label>
            <Input
              id="canteenName"
              placeholder="Enter the canteen name"
              {...register("canteenName")}
              className={errors.canteenName ? "border-red-500" : ""}
            />
            {errors.canteenName && (
              <p className="text-red-500 text-sm">
                {errors.canteenName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              placeholder="Enter the item name"
              {...register("itemName")}
              className={errors.itemName ? "border-red-500" : ""}
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm">{errors.itemName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setValue("rating", rating.toString())}
                  className={`p-2 rounded-full transition-all ${
                    watch("rating") === rating.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={
                      watch("rating") >= rating.toString()
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealTime">Meal Time</Label>
            <Select
              onValueChange={(value) => setValue("mealTime", value as "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Other")}
              defaultValue={initialData.mealTime || ""}
            >
              <SelectTrigger
                className={errors.mealTime ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a meal time" />
              </SelectTrigger>
              <SelectContent>
                {mealTimes.map((meal) => (
                  <SelectItem key={meal} value={meal}>
                    {meal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mealTime && (
              <p className="text-red-500 text-sm">{errors.mealTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment"> Comment</Label>
            <Textarea
              id="comment"
              placeholder="Add any  comment"
              rows={3}
              {...register("comment")}
              className={errors.comment ? "border-red-500" : ""}
            />
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
