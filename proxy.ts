import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The style guide is an internal page. On the production deployment it must not exist, so every request to it is
 * answered with the site's not found page and a 404 status. The decision is made when the request arrives, from the
 * environment of the running deployment. A static page that calls notFound() while it is prerendered still serves 200,
 * which is why this is done here and not in the page.
 */
export function proxy(request: NextRequest) {
  const production = process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_SITE_ENV === "production";
  if (production) return NextResponse.rewrite(new URL("/not-found-styleguide", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/styleguide", "/styleguide/:path*"] };
