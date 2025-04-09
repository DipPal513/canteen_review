"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Review {
  _id: string;
  canteenName: string;
  itemName: string;
  rating: number;
  comment: string;
  mealTime: "Breakfast" | "Snacks" | "Dinner" | "Lunch" | "Other";
  createdAt: Date;
  user: Object;
}

interface ReviewListProps {
  limit?: number;
  searchQuery?: string;
  filterCategory?: string;
  filterRating?: string;
  userOnly?: boolean;
}

export function ReviewList({
  limit,
  searchQuery = "",
  filterCategory = "all",
  filterRating = "all",
  userOnly = false,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({});
  console.log("reviews: ", reviews);
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/reviews");
        let filteredReviews = response.data?.reviews;
        setPaginationData(response?.data?.pagination)
        // Apply search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredReviews = filteredReviews.filter(
            (review: Review) =>
              review.comment.toLowerCase().includes(query) ||
              review.mealTime.toLowerCase().includes(query) ||
              review.itemName.toLowerCase().includes(query)
          );
        }

        // Apply rating filter
        if (filterRating && filterRating !== "all") {
          const minRating = Number.parseInt(filterRating);
          filteredReviews = filteredReviews.filter(
            (review: Review) => review.rating >= minRating
          );
        }

        // Apply limit if provided
        if (limit) {
          filteredReviews = filteredReviews.slice(0, limit);
        }

        setReviews(filteredReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit, searchQuery, filterCategory, filterRating, userOnly]);

  console.log(paginationData)
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews?.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No reviews found</p>
          <Link href="/reviews/add">
            <Button className="bg-[#2E1A73] hover:bg-[#231259]">
              Add a Review
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <Card key={review._id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{review.canteenName}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {/* {review.category} */}
                  </Badge>
                  <span className="mx-1">•</span>
                  {review.itemName}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{review.comment}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"
                  }
                  alt={"DEMO"}
                />
                {/* <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback> */}
              </Avatar>
              <div>
                <p className="text-sm font-medium">{review?.user?.name}</p>
                <p className="text-xs text-gray-500">
                  {/* {review.department}, {review.year} */}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500"
              >
                <ThumbsUp className="h-4 w-4" />
                {/* <span>{review.likes}</span> */}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500"
              >
                <MessageSquare className="h-4 w-4" />
                <span></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  {userOnly && (
                    <>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}

      {!limit && reviews?.length > 0 && (
       <Pagination>
       <PaginationContent>
         <PaginationItem>
           <PaginationPrevious href="#" />
         </PaginationItem>
         <PaginationItem>
           <PaginationLink href="#">1</PaginationLink>
         </PaginationItem>
         <PaginationItem>
           <PaginationEllipsis />
         </PaginationItem>
         <PaginationItem>
           <PaginationNext href="#" />
         </PaginationItem>
       </PaginationContent>
     </Pagination>
     
      )}
    </div>
  );
}
