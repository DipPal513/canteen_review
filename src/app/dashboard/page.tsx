"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewList } from "@/components/review-list";
import { Star, Users, PenSquare } from "lucide-react";
import { useAppContext } from "@/src/context/AppContext";
import useFetch from "@/utils/useFetch";

export default function DashboardPage() {
  const { user, loading } = useAppContext();
  const { data: allUsers } = useFetch("/users");
  console.log("allusers: ",allUsers)
  console.log("user", user);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/reviews/add">
          <Button className="bg-[#2E1A73] hover:bg-[#231259]">
            Add Review
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-[#2E1A73]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.reviews?.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-[#2E1A73]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers?.data?.length}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Reviews</CardTitle>
            <PenSquare className="h-4 w-4 text-[#2E1A73]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest reviews from the community</CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewList limit={5} />
          </CardContent>
        </Card>

        {/* <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Halls</CardTitle>
            <CardDescription>Halls with the most active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Jagannath Hall</p>
                  <p className="text-xs text-muted-foreground">
                    128 active users
                  </p>
                </div>
                <div className="font-bold text-[#2E1A73]">4.8</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fazlul Huq Muslim Hall</p>
                  <p className="text-xs text-muted-foreground">
                    112 active users
                  </p>
                </div>
                <div className="font-bold text-[#2E1A73]">4.7</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rokeya Hall</p>
                  <p className="text-xs text-muted-foreground">
                    98 active users
                  </p>
                </div>
                <div className="font-bold text-[#2E1A73]">4.6</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bangabandhu Hall</p>
                  <p className="text-xs text-muted-foreground">
                    87 active users
                  </p>
                </div>
                <div className="font-bold text-[#2E1A73]">4.5</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kabi Jasimuddin Hall</p>
                  <p className="text-xs text-muted-foreground">
                    76 active users
                  </p>
                </div>
                <div className="font-bold text-[#2E1A73]">4.4</div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
