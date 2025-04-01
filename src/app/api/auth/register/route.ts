import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define Zod schema for validation
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email format")
      .regex(/@du\.ac\.bd$/, "Only DU email addresses allowed"),
    phone: z
      .string()
      .regex(/^(\+8801[3-9]\d{8})$/, "Invalid Bangladeshi phone number"),
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

    // Here, you can add code to store the user in a database (MongoDB, PostgreSQL, etc.)
    console.log("User Data:", validatedData); // Debugging purpose

    return NextResponse.json(
      { message: "Registration successful", success: true },
      { status: 201 }
    );
  } catch (error:any) {
    return NextResponse.json(
      { error: error.errors ?? "Invalid request" },
      { status: 400 }
    );
  }
}
