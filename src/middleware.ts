import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  const host = request.headers.get("host") || "";
  const baseDomains = ["baaraat.com", "doomshell.com", "website-builder-frontend-three.vercel.app", "localhost"];
  const baseDomain = baseDomains.find((d) => host.endsWith(d));
  const subdomain = baseDomain ? host.replace(`.${baseDomain}`, "") : null;
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  // Skip static files or API calls
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Handle admin/user authentication
  if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const response = NextResponse.redirect(loginUrl);
      cookies.getAll().forEach((c) => response.cookies.set(c.name, "", { path: "/", maxAge: 0 }));
      return response;
    }
  }

  // 🌐 Handle Subdomain (tenant) requests
  if ((baseDomain && subdomain && subdomain !== "www") || isLocal) {
    const projectSlug = subdomain || pathname.split("/")[0];
    const newPath =
      isLocal && pathname.startsWith(`/${projectSlug}`)
        ? pathname.replace(`/${projectSlug}`, "")
        : pathname;

    const url = request.nextUrl.clone();
    url.pathname = `/site/${projectSlug}${newPath}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.\\..).*)"],
};