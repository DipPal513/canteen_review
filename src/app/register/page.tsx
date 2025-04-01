"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuLogo } from "@/components/du-logo";
import { connectDB } from "@/src/db/connection";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine((email) => email.endsWith("@du.ac.bd"), {
        message:
          "Only Dhaka University email addresses (@du.ac.bd) are allowed",
      }),
    phone: z.string().min(11, "Phone number must be at least 11 digits"),
    year: z.string().min(1, "Please select your year"),
    hall: z.string().min(1, "Please select your hall"),
    department: z.string().min(1, "Please enter your department"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

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
];

const studyYears = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Masters",
  "MPhil",
  "PhD",
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      year: "",
      hall: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    connectDB();
    setIsLoading(true);
    console.log("data: ", data);
    try {
      const response = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;
      console.log("result: ", result);
      if (response.status !== 100) {
        throw new Error(result.message || "Registration failed");
      }
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/login");
    } catch (error: any) {
      console.log("this is error: ", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50 p-4 py-8">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <DuLogo className="h-10 w-10" />
        <span className="text-xl font-bold text-[#2E1A73]">
          DU Student Portal
        </span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#2E1A73]">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to register for DU Student Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@du.ac.bd"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Your department"
                {...register("department")}
                className={errors.department ? "border-red-500" : ""}
              />
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Study Year</Label>
                <Select onValueChange={(value) => setValue("year", value)}>
                  <SelectTrigger
                    className={errors.year ? "border-red-500" : ""}
                  >
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
                {errors.year && (
                  <p className="text-red-500 text-sm">{errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hall">Hall</Label>
                <Select onValueChange={(value) => setValue("hall", value)}>
                  <SelectTrigger
                    className={errors.hall ? "border-red-500" : ""}
                  >
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
                {errors.hall && (
                  <p className="text-red-500 text-sm">{errors.hall.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2E1A73] hover:bg-[#231259]"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2E1A73] hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
