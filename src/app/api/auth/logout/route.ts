import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear all cookies
  response.cookies.set("token", "", { maxAge: 0 });

  return response;
}
