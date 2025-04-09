import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/db/connection";
import User from "@/src/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    await connectDB();

    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
