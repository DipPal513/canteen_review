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
import { useAppContext } from "@/src/context/AppContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  canteenName: string;
  itemName: string;
  rating: number;
  comment: string;
  mealTime: "Breakfast" | "Snacks" | "Dinner" | "Lunch" | "Other";
  createdAt: string;
  image?: string;
  user: {
    _id: string;
    name: string;
    [key: string]: any;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    
  });
  // Safely access context or provide fallback
  const appContext = useAppContext();
  const { user } = appContext;
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const router = useRouter();
const [modalImage, setModalImage] = useState<string | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openImageModal = (image: string) => {
  setModalImage(image);
  setIsModalOpen(true);
};

const closeImageModal = () => {
  setIsModalOpen(false);
  setModalImage(null);
};
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", limit ? limit.toString() : "10");

        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }

        if (filterCategory && filterCategory !== "all") {
          queryParams.append("category", filterCategory);
        }

        if (filterRating && filterRating !== "all") {
          queryParams.append("minRating", filterRating);
        }

        if (userOnly && user?._id) {
          queryParams.append("userId", user?._id);
        }

        const response = await axios.get(
          `${userOnly ? "/api/auth/me" : `/api/reviews?${queryParams.toString()}`}`
        );
        // Make sure we're setting reviews to an array, even if the response is unexpected
        setReviews(
          Array.isArray(response?.data?.reviews) ? response?.data?.reviews : []
        );
        console.log(response)
        setPaginationData(
          response.data.pagination || {
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        // Ensure reviews is set to an empty array on error
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [
    currentPage,
    limit,
    searchQuery,
    filterCategory,
    filterRating,
    userOnly,
    user?._id || "",
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReviewDelete = async (reviewId: string) => {
    try {
      const res = await axios.delete(`/api/delete-review?id=${reviewId}`);
      // Remove the deleted review from the state

      if (res.status == 200) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
        setReviewToDelete(null);
        toast.success("Review deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Error Deleting Review!");
    }
  };

  const handleEditReview = (reviewId: string) => {
    router.push(`/edit-review?id=${reviewId}`);
  };
console.log(reviews)
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

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No reviews found</p>
          <Link href="/dashboard/add-review">
            <Button className="bg-[#2E1A73] hover:bg-[#231259]">
              Add a Review
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3">
      {reviews &&
        reviews.map((review) => (
          <Card key={review?._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {review?.canteenName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {review?.mealTime}
                    </Badge>
                    <span className="mx-1">•</span>
                    {review?.itemName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review?.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{review?.comment}</p>
             {review?.image &&  <div className="mt-2">
              <div onClick={() => openImageModal(review?.image)}>
                
                <img src={review?.image} alt="review-image" />
              </div>
              </div>}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"
                    }
                    alt={review?.user?.name}
                  />
                  <AvatarFallback>
                    {review?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{review?.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
              
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {review?.user?._id === user?._id && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleEditReview(review._id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => setReviewToDelete(review._id)}
                        >
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

      {!limit &&
        reviews &&
        reviews.length > 0 &&
        paginationData.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(5, paginationData.totalPages) },
                  (_, i) => {
                    // Logic to show pages around current page
                    let pageNum;
                    if (paginationData.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= paginationData.totalPages - 2) {
                      pageNum = paginationData.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                {paginationData.totalPages > 5 &&
                  currentPage < paginationData.totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handlePageChange(paginationData.totalPages)
                          }
                        >
                          {paginationData.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(paginationData.totalPages, currentPage + 1)
                      )
                    }
                    className={
                      currentPage === paginationData.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this review?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                reviewToDelete && handleReviewDelete(reviewToDelete)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isModalOpen && modalImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
    onClick={closeImageModal}
  >
    <div
      className="max-w-full max-h-full p-4"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
    >
      <img
        src={modalImage}
        alt="Modal Preview"
        className="max-w-[90vw] max-h-[90vh] rounded-md object-contain"
      />
    </div>
    <button
      className="absolute top-4 right-4 text-white text-xl"
      onClick={closeImageModal}
    >
      ✕
    </button>
  </div>
)}

    </div>
  );
}
