import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const token = cookies.get("admin_token")?.value;

  const host = request.headers.get("host") || "";
  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("webbuilder.local");

  const baseDomains = [
    "baaraat.com",
    "doomshell.com",
    "website-builder-frontend-three.vercel.app",
    "localhost",
    "webbuilder.local",
  ];

  const baseDomain = baseDomains.find((d) => host.endsWith(d));
  const subdomain = baseDomain ? host.replace(`.${baseDomain}`, "") : null;

  // Skip assets & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Admin pages → only on main domain
// ✅ Allow /admin, /administrator, /user on main and local dev domains
if (
  (pathname.startsWith("/admin") ||
    pathname.startsWith("/administrator") ||
    pathname.startsWith("/user")) &&
  !["baaraat.com", "www.baaraat.com", "webbuilder.local:3000", "localhost:3000"].includes(host)
) {
  const homeUrl = new URL("/", request.url);
  return NextResponse.redirect(homeUrl);
}

  // Auth check (main domain only)
  if (
    (host === "baaraat.com" || host === "www.baaraat.com") &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/administrator") ||
      pathname.startsWith("/user"))
  ) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const res = NextResponse.redirect(loginUrl);
      cookies.getAll().forEach((c) =>
        res.cookies.set(c.name, "", { path: "/", maxAge: 0 })
      );
      return res;
    }
  }

  // Subdomain or local site
  if (
    (baseDomain && subdomain && subdomain !== "www" && !host.includes("baaraat.com")) ||
    isLocal
  ) {
    // ✅ Allow these domains directly
    if (
      subdomain === "webbuilder" ||
      host === "webbuilder.local:3000" ||
      host === "website-builder-frontend-three.vercel.app" ||
      host === "www.navlokcolonizers.com"
    ) {
      return NextResponse.next();
    }

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
