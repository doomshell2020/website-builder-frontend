import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  const host = request.headers.get("host") || "";
  const isLocal =
    host.includes("localhost") || host.includes("127.0.0.1");

  const baseDomains = [
    "baaraat.com",
    "doomshell.com",
    "website-builder-frontend-three.vercel.app",
    "localhost",
  ];

  // Detect main/base domain
  const baseDomain = baseDomains.find((d) => host.endsWith(d));
  const subdomain = baseDomain ? host.replace(`.${baseDomain}`, "") : null;

  // 🚫 Skip static assets & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ✅ Allow /admin, /administrator, /user ONLY on main domain (baaraat.com)
  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/administrator") ||
      pathname.startsWith("/user")) &&
    host !== "baaraat.com"
  ) {
    // Other domains/subdomains trying to access admin => redirect to their homepage
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 🔒 Auth check for admin/user on main domain
  if (
    host === "baaraat.com" &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/administrator") ||
      pathname.startsWith("/user"))
  ) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const response = NextResponse.redirect(loginUrl);
      cookies.getAll().forEach((c) =>
        response.cookies.set(c.name, "", { path: "/", maxAge: 0 })
      );
      return response;
    }
  }

  // 🌐 Handle subdomain-based tenant sites
  if (
    (baseDomain && subdomain && subdomain !== "www" && host !== "baaraat.com") ||
    isLocal
  ) {
    // Special: allow vercel preview and dev hostnames to pass normally
    if (
      subdomain === "webbuilder" ||
      host === "website-builder-frontend-three.vercel.app" ||
      host === "www.navlokcolonizers.com"
    ) {
      return NextResponse.next();
    }

    // Rewrite subdomain traffic to /site/{projectSlug}
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
  matcher: ["/((?!_next|.*\\..*).*)"],
};
