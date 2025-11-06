import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  // ✅ Use x-forwarded-host (Vercel uses this)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  const baseDomains = [
    "baaraat.com",
    "doomshell.com",
    "website-builder-frontend-three.vercel.app",
    "localhost",
  ];

  const baseDomain = baseDomains.find((d) => host.endsWith(d));
  const subdomain = baseDomain ? host.replace(`.${baseDomain}`, "") : null;

  const token = cookies.get("admin_token")?.value;

  // Skip static & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/administrator") ||
    pathname.startsWith("/user");

  // 🧭 Redirect baaraat.com → www.baaraat.com (only once)
  if (host === "baaraat.com") {
    const url = request.nextUrl.clone();
    url.host = "www.baaraat.com";
    return NextResponse.redirect(url);
  }

  // ✅ Only allow admin routes on www.baaraat.com
  if (isAdminRoute && host !== "www.baaraat.com") {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 🛑 Prevent redirect loop on /administrator (login page)
  if (pathname === "/administrator") {
    return NextResponse.next();
  }

  // 🔒 Require token for other admin routes
  if (isAdminRoute && !token) {
    const loginUrl = new URL("/administrator", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🌐 Handle tenant subdomains
  if (
    (baseDomain &&
      subdomain &&
      subdomain !== "www" &&
      host !== "www.baaraat.com") ||
    isLocal
  ) {
    if (
      subdomain === "webbuilder" ||
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
