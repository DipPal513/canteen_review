import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// Adjust the path to your connectdb function
import User from "@/src/models/user.model"; // Adjust the path to your User schema
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { connectDB } from "@/src/db/connection";

// Define Zod schema for validation
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

// Handle POST request for registration
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
        { error: "User with this email already exists" },
        { status: 400 }
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
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registration successful", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors ?? "Invalid request" },
      { status: 400 }
    );
  }
}
