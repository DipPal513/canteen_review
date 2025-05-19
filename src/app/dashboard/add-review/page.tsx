"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useAppContext } from "@/src/context/AppContext";

// UI Components
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

// Constants - Updated to match backend expectations
const MEAL_TIMES = ["Breakfast", "Lunch", "Dinner", "Snack", "others"];
const REDIRECT_DEFAULT = "/reviews";

// Schema definition for review form validation - Updated to match backend requirements
const reviewSchema = Yup.object().shape({
  canteenName: Yup.string().required("Canteen name is required"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5")
    .required("Please select a rating"),
  itemName: Yup.string()
    .min(5, "Item name must be at least 5 characters")
    .required("Item name is required"),
  mealTime: Yup.string()
    .oneOf(MEAL_TIMES, "Invalid meal time selection")
    .required("Meal time is required"),
  comment: Yup.string()
    .min(5, "Comment must be at least 5 characters")
    .required("Comment is required"),
  image: Yup.mixed().required("Image is required"),
  user: Yup.string().required("User ID is required"),
});

interface ReviewFormProps {
  onSubmitSuccess?: (data: any) => void;
  initialData?: Partial<ReviewFormValues>;
  redirectPath?: string;
}

interface ReviewFormValues {
  canteenName: string;
  rating: number;
  itemName: string;
  mealTime: string;
  comment: string;
  image: File | null;
  user: string;
}

export default function ReviewForm({
  onSubmitSuccess,
  initialData = {},
  redirectPath = REDIRECT_DEFAULT,
}: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { user } = useAppContext();

  // Function to handle form submission
  const handleSubmit = async (values: ReviewFormValues) => {
    setIsLoading(true);
    try {
      // if (!values.user)
      //   throw new Error(
      //     "User ID is missing. Please log in to submit a review."
      //   );

      // Prepare the data to match backend expectations
      const reviewData = {
        ...values,
        rating: Number(values.rating), // Ensure rating is a number
      };

      // Handle image conversion to base64 if present
      if (values.image instanceof File) {
        const base64Image = await convertFileToBase64(values.image);
        reviewData.image = base64Image;
      }

      // Send the request with JSON format as expected by the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.join(", ") || "Failed to submit review"
        );
      }

      toast.success("Review submitted successfully!");
      onSubmitSuccess ? onSubmitSuccess(values) : router.push(redirectPath);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Convert File to base64 string for backend
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image preview
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("image", file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("image", null);
      setPreviewImage(null);
    }
  };

  // If not logged in, show a message
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin border-t-transparent"></div>
    </div>
    );
  }

  return (
    <Card className="shadow-lg max-w-screen-xl mx-auto mt-24">
      <CardHeader>
        <CardTitle>New Review</CardTitle>
        <CardDescription>
          Fill out the form below to add your review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            canteenName: initialData.canteenName || "",
            rating: initialData.rating || 0,
            itemName: initialData.itemName || "",
            mealTime: initialData.mealTime || "others",
            comment: initialData.comment || "",
            image: initialData.image || null,
            user: user?._id || "",
          }}
          validationSchema={reviewSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Hidden field for user */}
              <input type="hidden" name="user" value={values.user} />

              <div className="space-y-2">
                <Label htmlFor="canteenName">Canteen Name</Label>
                <Field
                  id="canteenName"
                  name="canteenName"
                  placeholder="Enter the canteen name"
                  as={Input}
                  className="border"
                />
                <ErrorMessage
                  name="canteenName"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Field
                  id="itemName"
                  name="itemName"
                  placeholder="Enter the item name (min 5 characters)"
                  as={Input}
                  className="border"
                />
                <ErrorMessage
                  name="itemName"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFieldValue("rating", rating)}
                      className={`p-2 rounded-full transition-all ${
                        values.rating === rating
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      aria-label={`Rate ${rating} stars`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={values.rating >= rating ? "currentColor" : "none"}
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
                <ErrorMessage
                  name="rating"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealTime">Meal Time</Label>
                <Select
                  onValueChange={(value) => setFieldValue("mealTime", value)}
                  defaultValue={values.mealTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meal time" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TIMES.map((meal) => (
                      <SelectItem key={meal} value={meal}>
                        {meal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="mealTime"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Field
                  id="comment"
                  name="comment"
                  placeholder="Add your comment (min 5 characters)"
                  as={Textarea}
                  rows={3}
                  className="border"
                />
                <ErrorMessage
                  name="comment"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e, setFieldValue);
                  }}
                  className="border"
                />
                <ErrorMessage
                  name="image"
                  component="p"
                  className="text-red-500 text-sm"
                />
                {previewImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-40 rounded border"
                    />
                  </div>
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
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
