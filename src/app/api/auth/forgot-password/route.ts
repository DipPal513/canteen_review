import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/src/db/connection";
import User from "@/src/models/user.model";
import crypto from "crypto";
import nodemailer from "nodemailer";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/du\.ac\.bd$/, "Only du.ac.bd emails are allowed"),
});

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const parsedData = forgotPasswordSchema.parse(body);

    const { email } = parsedData;
    console.log("Email: ", email);

    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = jwt.sign({ email }, "your_jwt_secret", { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: true,
      auth: {
        user: "dip.pal.513@gmail.com",
        pass: "uqyvqdyfwmnkwziq",
      },
    });

    const receiver = {
      from: "pretom.pal.513@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to generate your new password: 
        localhost:3000/reset-password/ ${token}`,
    };
    await transporter.sendMail(receiver);

    return NextResponse.json({
      status: 200,
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (error: any) {
    console.log("this is error: ", error);
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
