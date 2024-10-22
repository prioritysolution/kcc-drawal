import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("isAuthenticated");

  // Protect the generateForm route
  if (!isAuthenticated && request.nextUrl.pathname === "/generateForm") {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home if not authenticated
  }

  // If authenticated and trying to access home, redirect to generateForm or another page
  if (isAuthenticated && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/generateForm", request.url)); // Change to your desired redirect page
  }

  return NextResponse.next();
}

// Configuring the middleware to match the routes
export const config = {
  matcher: ["/generateForm", "/"], // Protect home and generateForm routes
};
