import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  getSessionTokenRefresh,
  sessionCookieOptions,
} from "@/lib/sessionCore";

export async function proxy(request) {
  const response = NextResponse.next();
  const currentToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const refreshedSession = await getSessionTokenRefresh(currentToken);

  if (refreshedSession) {
    response.cookies.set(
      SESSION_COOKIE_NAME,
      refreshedSession.token,
      sessionCookieOptions(refreshedSession.expiresAt),
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
