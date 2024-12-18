import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, secret } = await req.json(); // Receive the data from client

    if (!username || !secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and secret are required.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ name: username, secret });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or secret.",
        },
        { status: 401 }
      );
    }

    const role = user.role || "client"; // Assume users have a 'role' field in the database (either 'client' or 'admin')

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful!",
      role,
    });

    response.cookies.set("isAuthenticated", role, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    }); // Set role in cookie
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during authentication.",
      },
      { status: 500 }
    );
  }
}
