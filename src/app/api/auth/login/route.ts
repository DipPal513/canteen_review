import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/db/connection";
import User from "@/src/models/user.model";
import rateLimit from "express-rate-limit";
// import { runMiddleware } from "@/src/utils/runMiddleware"; // Utility to run middleware

// Define Zod schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/du\.ac\.bd$/, "Only du.ac.bd emails are allowed"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// JWT secret key (store securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: "Too many login attempts, please try again later." },
});

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    // Run rate limiter middleware
    // await runMiddleware(req, limiter);

    // Parse and validate the request body
    const body = await req.json();
    const parsedData = loginSchema.parse(body);

    const { email, password } = parsedData;

    // Connect to the database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Set the token in a cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      data: { email: user.email, name: user.name }, // Return only safe fields
    });
    response.cookies.set("token", token, {
      httpOnly: true, // Prevent client-side access
      secure: true, // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
