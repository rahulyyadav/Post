import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_EMAIL = "basundharayadav94@gmail.com"; // Your email for testing

export async function POST(request: Request) {
  try {
    // Log the API key (remove in production)
    console.log("API Key exists:", !!process.env.RESEND_API_KEY);

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    const { email, otp } = body;

    // Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    console.log("Attempting to send email to:", email);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's testing domain
      to: TEST_EMAIL, // During testing, always send to your email
      subject: "Your OTP for Chat App",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5B45E0; margin-bottom: 20px;">Verify your email</h2>
          <p style="margin-bottom: 15px;">Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p style="margin-top: 15px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #888; font-size: 14px; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
          <p style="color: #888; font-size: 14px;">Testing Mode: Original recipient was ${email}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 400 }
      );
    }

    console.log("Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      data: data,
    });
  } catch (error: any) {
    console.error("Server error details:", error);
    return NextResponse.json(
      {
        error: "Failed to send OTP",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
