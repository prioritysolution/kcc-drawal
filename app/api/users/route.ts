import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

// GET: Fetch all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: unknown) {
    // Narrow down the type of `error`
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Add a new user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const user = await User.create(data);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: unknown) {
    // Narrow the type of `error`
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
