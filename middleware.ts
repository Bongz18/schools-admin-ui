import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the active session from the request
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no session, redirect to the public login page
  if (!session) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // If authenticated but not an admin according to app_metadata.role, redirect to /unauthorized
  const role = (session.user?.app_metadata as any)?.role;
  if (role !== "admin") {
    const url = new URL("/unauthorized", req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
