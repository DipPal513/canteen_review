import { connectDB } from "@/src/db/connection";
import User from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating the request body
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Environment variable fallback
const JWT_SECRET =  "your_jwt_secret";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { password } = resetPasswordSchema.parse(body);

    // Connect to the database
    
    // Verify the token
    let email: string;
    try {
      
      await connectDB();
    

      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
     

      email = decoded.email;

    } catch (err) {
     
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    return NextResponse.json({
      status: 200,
      message: "Password reset successfully",
      success: true,
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
