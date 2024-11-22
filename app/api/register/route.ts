import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { society, username, password } = await req.json(); // Receive the data from client

    if (!society || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Society, username and password are required.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const user = await db.collection("admins").findOne({ society });

    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "This society already registered with us",
        },
        { status: 401 }
      );
    }

    const admin = await Admin.create({ society, username, password });
    return NextResponse.json({ success: true, data: admin }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during registration.",
      },
      { status: 500 }
    );
  }
}
