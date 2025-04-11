"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Star, Mail } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

interface User {
  name: string;
  email: string;
  phone: string;
  year: string;
  hall: string;
  _id: string;
  department: string;
  password: string;
  reviews: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface UserListProps {
  searchQuery?: string;
  filterYear?: string;
  filterHall?: string;
}

export function UserList({
  searchQuery = "",
  filterYear = "all",
  filterHall = "all",
}: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", paginationData.limit.toString());

        const response = await axios.get(`/api/users?${queryParams.toString()}`);
        const { data, page, totalItems, totalPages } = response.data;

        setUsers(data);
        setPaginationData({ page, limit: paginationData.limit, totalItems, totalPages });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery, filterYear, filterHall]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users?.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">
            No users found matching your criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <Card key={user._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-[#2E1A73]/10">
                  <AvatarFallback className="text-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.department}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {user.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {user.hall.split(" ")[0]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/users/${user._id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full text-[#2E1A73] border-[#2E1A73] hover:bg-[#2E1A73]/10"
                  >
                    View Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-[#2E1A73]">
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#2E1A73]">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={paginationData.page}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
