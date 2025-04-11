import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import User from "@/src/models/user.model";
import bcrypt from "bcrypt";
import { connectDB } from "@/src/db/connection";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email format")
      .regex(/du\.ac\.bd$/, "Only DU email addresses allowed"),
    phone: z
      .string()
      .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    year: z.string().min(1, "Year is required"),
    hall: z.string().min(2, "Hall name is required"),
    department: z.string().min(2, "Department is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const validatedData = registerSchema.parse(body);

    // Connect to the database
    await connectDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists", success: false },
        { status: 409 } // Conflict status code
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create a new user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      year: validatedData.year,
      hall: validatedData.hall,
      department: validatedData.department,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registration successful", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 422 } // Unprocessable Entity status code
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 } // Internal Server Error status code
    );
  }
}
