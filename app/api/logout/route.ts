import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
  response.cookies.set("isAuthenticated", "", { maxAge: 0 }); // Clear the cookie
  return response;
}
