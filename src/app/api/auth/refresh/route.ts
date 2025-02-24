import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccessToken } from "@/utils/jwt";

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Verify refresh token and generate new access token
    // This is where you'd validate the refresh token with your backend
    const newAccessToken = generateAccessToken(/* user data */);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
