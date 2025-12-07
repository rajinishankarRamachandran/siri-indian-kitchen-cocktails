import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, redirect to login as a fallback
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};