"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewList } from "@/components/review-list"
import { Search, PlusCircle } from "lucide-react"

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterRating, setFilterRating] = useState("all")

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2E1A73]">Reviews</h1>
          <p className="text-gray-600">Browse and search reviews from DU students</p>
        </div>
        <Link href="/reviews/add">
          <Button className="bg-[#2E1A73] hover:bg-[#231259] flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Review</span>
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Reviews</CardTitle>
          <CardDescription>Find specific reviews using filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="hall">Hall</SelectItem>
                  <SelectItem value="canteen">Canteen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReviewList searchQuery={searchQuery} filterCategory={filterCategory} filterRating={filterRating} />
    </div>
  )
}

