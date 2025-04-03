"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Star, Mail } from "lucide-react";

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User[]>("/api/users");
        let filteredUsers = response.data.data;
        console.log(response)

        // Apply search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(query) ||
              user.department.toLowerCase().includes(query) ||
              user.email.toLowerCase().includes(query)
          );
        }

        // Apply year filter
        if (filterYear && filterYear !== "all") {
          filteredUsers = filteredUsers.filter(
            (user) => user.year === filterYear
          );
        }

        // Apply hall filter
        if (filterHall && filterHall !== "all") {
          filteredUsers = filteredUsers.filter(
            (user) => user.hall === filterHall
          );
        }

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, filterYear, filterHall]);

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card key={user._id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-[#2E1A73]/10">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
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

            {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p> */}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {/* <span className="text-sm font-medium">{user.rating}</span> */}
                {/* <span className="text-xs text-gray-500">({user.reviewCount} reviews)</span> */}
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
  );
}
