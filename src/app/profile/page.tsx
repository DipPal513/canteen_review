"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewList } from "@/components/review-list"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").endsWith("@du.ac.bd", {
    message: "Only Dhaka University email addresses (@du.ac.bd) are allowed",
  }),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  department: z.string().min(1, "Please enter your department"),
  year: z.string().min(1, "Please select your year"),
  hall: z.string().min(1, "Please select your hall"),
  bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const duHalls = [
  "Jagannath Hall",
  "Salimullah Muslim Hall",
  "Fazlul Huq Muslim Hall",
  "Shahidullah Hall",
  "Haji Muhammad Mohsin Hall",
  "Shamsunnahar Hall",
  "Rokeya Hall",
  "Begum Fazilatunnesa Mujib Hall",
  "Kabi Jasimuddin Hall",
  "A.F. Rahman Hall",
  "Bangabandhu Sheikh Mujibur Rahman Hall",
  "Surja Sen Hall",
  "Bijoy Ekattor Hall",
  "Bangladesh-Kuwait Maitree Hall",
  "Amar Ekushey Hall",
  "Muktijoddha Ziaur Rahman Hall",
  "Bangamata Sheikh Fazilatunnesa Mujib Hall",
  "Kabi Sufia Kamal Hall",
]

const studyYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters", "MPhil", "PhD"]

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Rahul Ahmed",
      email: "rahul.ahmed@du.ac.bd",
      phone: "01712345678",
      department: "Computer Science and Engineering",
      year: "3rd Year",
      hall: "Fazlul Huq Muslim Hall",
      bio: "Computer Science student at Dhaka University. Interested in web development and artificial intelligence.",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just show success
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E1A73]">My Profile</h1>
        <p className="text-gray-600">Manage your account information and reviews</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">Rahul Ahmed</h2>
            <p className="text-sm text-gray-500">Computer Science and Engineering</p>
            <p className="text-sm text-gray-500">3rd Year</p>
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reviews</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium">March 2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hall</span>
                <span className="font-medium">Fazlul Huq Muslim Hall</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className={errors.email ? "border-red-500" : ""}
                          disabled
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          {...register("department")}
                          className={errors.department ? "border-red-500" : ""}
                        />
                        {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="year">Study Year</Label>
                        <Select defaultValue="3rd Year" onValueChange={(value) => setValue("year", value)}>
                          <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {studyYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hall">Hall</Label>
                        <Select
                          defaultValue="Fazlul Huq Muslim Hall"
                          onValueChange={(value) => setValue("hall", value)}
                        >
                          <SelectTrigger className={errors.hall ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select hall" />
                          </SelectTrigger>
                          <SelectContent>
                            {duHalls.map((hall) => (
                              <SelectItem key={hall} value={hall}>
                                {hall}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.hall && <p className="text-red-500 text-sm">{errors.hall.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" rows={4} {...register("bio")} />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-[#2E1A73] hover:bg-[#231259]" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                  <CardDescription>Reviews you have posted</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewList userOnly={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#2E1A73] hover:bg-[#231259]">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

