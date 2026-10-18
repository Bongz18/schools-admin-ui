import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Create a Supabase client attached to the middleware request/response
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session, redirect to the admin login
  if (!session) {
    const url = new URL("/admin/login", req.url);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated but not an admin, redirect to /unauthorized
  const role = (session.user.app_metadata as any)?.role;
  if (role !== "admin") {
    const url = new URL("/unauthorized", req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request through
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
