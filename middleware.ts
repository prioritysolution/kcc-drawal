import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("isAuthenticated")?.value;

  // Redirect if the user is authenticated and tries to access login or register routes
  if (isAuthenticated) {
    const url = req.nextUrl.clone();

    // Prevent redirect loop if already on /login or /register
    if (url.pathname === "/login" || url.pathname === "/register") {
      return NextResponse.redirect(new URL("/generateForm", req.url)); // Redirect to /generateForm
    }

    // Allow authenticated users to access other pages
    if (
      url.pathname === "/" ||
      url.pathname === "/login" ||
      url.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/generateForm", req.url));
    }
  }

  // If user is not authenticated, only allow access to login and register routes
  if (!isAuthenticated) {
    const url = req.nextUrl.clone();

    // Redirect unauthenticated users trying to access pages other than login or register
    if (
      url.pathname !== "/login" &&
      url.pathname !== "/register" &&
      url.pathname !== "/"
    ) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
    }
  }

  // Allow the request to continue for other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/users",
    "/generateForm",
    "/tamshukForm",
  ], // Add any other routes you need to match
};
