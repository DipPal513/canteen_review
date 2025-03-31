"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const reviewSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  rating: z.string().min(1, "Please select a rating"),
  content: z.string().min(20, "Review content must be at least 20 characters"),
  itemName: z.string().min(2, "Name must be at least 2 characters"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export default function AddReviewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      category: "",
      rating: "",
      content: "",
      itemName: "",
    },
  })

  const selectedCategory = watch("category")

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just show success and redirect
      toast.success("Review added successfully!")
      router.push("/reviews")
    } catch (error) {
      toast.error("Failed to add review. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E1A73]">Add Review</h1>
        <p className="text-gray-600">Share your experience with the DU community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Review</CardTitle>
          <CardDescription>Fill out the form below to add your review</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your review"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="facility">Facility</SelectItem>
                    <SelectItem value="hall">Hall</SelectItem>
                    <SelectItem value="canteen">Canteen</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName">
                  {selectedCategory === "course" && "Course Name"}
                  {selectedCategory === "professor" && "Professor Name"}
                  {selectedCategory === "facility" && "Facility Name"}
                  {selectedCategory === "hall" && "Hall Name"}
                  {selectedCategory === "canteen" && "Canteen Name"}
                  {!selectedCategory && "Name"}
                </Label>
                <Input
                  id="itemName"
                  placeholder={`Enter ${selectedCategory || "item"} name`}
                  {...register("itemName")}
                  className={errors.itemName ? "border-red-500" : ""}
                />
                {errors.itemName && <p className="text-red-500 text-sm">{errors.itemName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <RadioGroup onValueChange={(value) => setValue("rating", value)} className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      {rating} {rating === 1 ? "Star" : "Stars"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content</Label>
              <Textarea
                id="content"
                placeholder="Write your review here..."
                rows={6}
                {...register("content")}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2E1A73] hover:bg-[#231259]" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

