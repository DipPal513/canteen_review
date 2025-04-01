import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define Zod schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/@du\.ac\.bd$/, "Only du.ac.bd emails are allowed"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body

    // Validate input using Zod
    const validatedData = loginSchema.parse(body);

    return NextResponse.json({
      message: "Login successful",
      success: true,
      data: validatedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors ?? "Invalid request" },
      { status: 400 }
    );
  }
}
