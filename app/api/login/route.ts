import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json(); // Receive the data from client

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const user = await db.collection("admins").findOne({ username, password });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful!",
    });
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
