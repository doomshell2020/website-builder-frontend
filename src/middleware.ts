import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  const host = request.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  const baseDomains = [
    "baaraat.com",
    "doomshell.com",
    "website-builder-frontend-three.vercel.app",
    "localhost",
  ];

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

  // ✅ Allow admin/user pages only on www.baaraat.com
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/administrator") ||
    pathname.startsWith("/user");

  if (isAdminRoute && host !== "www.baaraat.com") {
    // Disallow admin on any other domain
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 🔒 Require token for admin/user routes on www.baaraat.com
  if (host === "www.baaraat.com" && isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const response = NextResponse.redirect(loginUrl);
      cookies.getAll().forEach((c) =>
        response.cookies.set(c.name, "", { path: "/", maxAge: 0 })
      );
      return response;
    }
  }

  // 🌐 Handle subdomain tenant sites
  if (
    (baseDomain &&
      subdomain &&
      subdomain !== "www" &&
      host !== "www.baaraat.com") ||
    isLocal
  ) {
    // Allow vercel preview & known test domains
    if (
      subdomain === "webbuilder" ||
      host === "website-builder-frontend-three.vercel.app" ||
      host === "www.navlokcolonizers.com"
    ) {
      return NextResponse.next();
    }

    // Rewrite tenant subdomain to /site/{slug}
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
