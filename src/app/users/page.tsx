"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserList } from "@/components/user-list"
import { Search } from "lucide-react"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterHall, setFilterHall] = useState("all")
  const [filterYear, setFilterYear] = useState("all")

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E1A73]">Users</h1>
        <p className="text-gray-600">Connect with other Dhaka University students</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Users</CardTitle>
          <CardDescription>Search and filter to find specific users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2 md:col-span-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="MPhil">MPhil</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filterHall} onValueChange={setFilterHall}>
                <SelectTrigger>
                  <SelectValue placeholder="Hall" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  <SelectItem value="Jagannath Hall">Jagannath Hall</SelectItem>
                  <SelectItem value="Salimullah Muslim Hall">Salimullah Muslim Hall</SelectItem>
                  <SelectItem value="Fazlul Huq Muslim Hall">Fazlul Huq Muslim Hall</SelectItem>
                  <SelectItem value="Rokeya Hall">Rokeya Hall</SelectItem>
                  <SelectItem value="Bangabandhu Hall">Bangabandhu Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserList searchQuery={searchQuery} filterYear={filterYear} filterHall={filterHall} />
    </div>
  )
}

