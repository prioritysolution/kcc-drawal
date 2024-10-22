import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define User type
interface User {
  username: string;
  secret: string;
}

// Helper functions to get file path and data
const getFilePath = (): string =>
  path.resolve(process.cwd(), "data", "userDatabase.json");

const getData = (): { users: User[] } => {
  const filePath = getFilePath();
  const fileData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileData);
};

// POST request handler
export async function POST(req: NextRequest) {
  try {
    const { username, secret } = await req.json();

    if (!username || !secret) {
      return NextResponse.json(
        { success: false, message: "Username and Secret are required" },
        { status: 400 }
      );
    }

    // Get users from file-based database
    const data = getData();
    const user = data.users.find(
      (u) => u.username === username && u.secret === secret
    );

    if (user) {
      return NextResponse.json({
        success: true,
        message: "Authentication successful",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error parsing request" },
      { status: 500 }
    );
  }
}
