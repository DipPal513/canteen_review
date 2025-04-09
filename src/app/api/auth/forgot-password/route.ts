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
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;"> Reset Your Password</h2>
        <p style="color: #374151; margin-bottom: 16px;">
          Hi there,
        </p>
        <p style="color: #374151; margin-bottom: 16px;">
          We received a request to reset your password. Click the button below to create a new one:
        </p>
        <a href="http://localhost:3000/reset-password/${token}" 
           style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          This link will expire in 30 minutes. If you did not request a password reset, you can safely ignore this email.
        </p>
        <p style="margin-top: 30px; color: #9ca3af; font-size: 13px;">
          — Dip Pal 
        </p>
      </div>
      `,
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
