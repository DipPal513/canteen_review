"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    title: "Great Computer Science Department",
    content:
      "The Computer Science department has excellent professors and up-to-date curriculum. The lab facilities are also very good with modern equipment.",
    rating: 5,
    category: "department",
    itemName: "Computer Science and Engineering",
    author: {
      id: 1,
      name: "Rahul Ahmed",
      department: "Computer Science and Engineering",
      year: "3rd Year",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 24,
    comments: 5,
    createdAt: "2023-12-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Dr. Rahman is an Excellent Teacher",
    content:
      "Dr. Rahman explains complex topics in a very simple way. His teaching methods are engaging and he's always available for students' questions.",
    rating: 5,
    category: "professor",
    itemName: "Dr. Abdur Rahman",
    author: {
      id: 2,
      name: "Fatima Khan",
      department: "Physics",
      year: "4th Year",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 18,
    comments: 3,
    createdAt: "2023-12-10T14:20:00Z",
  },
  {
    id: 3,
    title: "Central Library Needs Improvement",
    content:
      "The central library has a good collection of books but the reading space is often crowded. The online catalog system needs to be updated for better usability.",
    rating: 3,
    category: "facility",
    itemName: "Central Library",
    author: {
      id: 3,
      name: "Karim Hossain",
      department: "English",
      year: "Masters",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 32,
    comments: 8,
    createdAt: "2023-12-05T09:15:00Z",
  },
  {
    id: 4,
    title: "Jagannath Hall Food Quality",
    content:
      "The food quality at Jagannath Hall canteen has improved significantly in the last semester. The menu variety is good and prices are reasonable for students.",
    rating: 4,
    category: "hall",
    itemName: "Jagannath Hall",
    author: {
      id: 4,
      name: "Amit Das",
      department: "History",
      year: "2nd Year",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 15,
    comments: 2,
    createdAt: "2023-11-28T18:45:00Z",
  },
  {
    id: 5,
    title: "TSC Canteen Review",
    content:
      "TSC canteen offers a variety of food options at affordable prices. The place gets very crowded during lunch hours, but the service is quick.",
    rating: 4,
    category: "canteen",
    itemName: "TSC Canteen",
    author: {
      id: 5,
      name: "Nusrat Jahan",
      department: "Economics",
      year: "3rd Year",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 27,
    comments: 6,
    createdAt: "2023-11-20T12:10:00Z",
  },
  {
    id: 6,
    title: "Data Structures Course",
    content:
      "The Data Structures course is well-structured and challenging. The assignments help in understanding the concepts thoroughly. Highly recommended for CS students.",
    rating: 5,
    category: "course",
    itemName: "Data Structures and Algorithms",
    author: {
      id: 1,
      name: "Rahul Ahmed",
      department: "Computer Science and Engineering",
      year: "3rd Year",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 21,
    comments: 4,
    createdAt: "2023-11-15T16:30:00Z",
  },
]

interface ReviewListProps {
  limit?: number
  searchQuery?: string
  filterCategory?: string
  filterRating?: string
  userOnly?: boolean
}

export function ReviewList({
  limit,
  searchQuery = "",
  filterCategory = "all",
  filterRating = "all",
  userOnly = false,
}: ReviewListProps) {
  const [reviews, setReviews] = useState(mockReviews)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    setLoading(true)
    setTimeout(() => {
      let filteredReviews = [...mockReviews]

      // Filter by user if userOnly is true
      if (userOnly) {
        filteredReviews = filteredReviews.filter((review) => review.author.id === 1) // Assuming logged in user has ID 1
      }

      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.title.toLowerCase().includes(query) ||
            review.content.toLowerCase().includes(query) ||
            review.itemName.toLowerCase().includes(query),
        )
      }

      // Apply category filter
      if (filterCategory && filterCategory !== "all") {
        filteredReviews = filteredReviews.filter((review) => review.category === filterCategory)
      }

      // Apply rating filter
      if (filterRating && filterRating !== "all") {
        const minRating = Number.parseInt(filterRating)
        filteredReviews = filteredReviews.filter((review) => review.rating >= minRating)
      }

      // Apply limit if provided
      if (limit) {
        filteredReviews = filteredReviews.slice(0, limit)
      }

      setReviews(filteredReviews)
      setLoading(false)
    }, 500)
  }, [limit, searchQuery, filterCategory, filterRating, userOnly])

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
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No reviews found</p>
          <Link href="/reviews/add">
            <Button className="bg-[#2E1A73] hover:bg-[#231259]">Add a Review</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{review.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {review.category}
                  </Badge>
                  <span className="mx-1">•</span>
                  {review.itemName}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{review.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.author.avatar} alt={review.author.name} />
                <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{review.author.name}</p>
                <p className="text-xs text-gray-500">
                  {review.author.department}, {review.author.year}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{review.comments}</span>
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
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}

      {!limit && reviews.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  )
}

