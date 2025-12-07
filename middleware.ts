import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Check for bearer token in Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const bearerToken = request.cookies.get("better-auth.session_token")?.value;
    
    // If no authentication token found, redirect to login
    if (!authHeader && !bearerToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, allow the request to continue
    // This prevents blocking the entire site
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};