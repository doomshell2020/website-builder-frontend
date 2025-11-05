import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  // ==========================================================
  // 🏠 Extract domain + subdomain info
  // ==========================================================
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0]; // strip port
  const isLocal = host === "localhost" || host === "127.0.0.1";

  // List of allowed root domains (supports both base + subdomains)
  const baseDomains = [
    "webbuilder.local",
    "lvh.me",
    "doomshell.com",
    "localhost",
    "website-builder-frontend-three.vercel.app",
    "navlokcolonizers.com",
  ];

  // Match known base domain
  const baseDomain = baseDomains.find((d) => host.endsWith(d));

  // Extract subdomain
  const subdomain =
    baseDomain && host !== baseDomain
      ? host.replace(`.${baseDomain}`, "")
      : null;

  // Derive the main "project name"
  // If it's a subdomain → use it
  // If it's a top-level domain (like navlokcolonizers.com) → use the domain prefix (navlokcolonizers)
  let projectSlug: string | null = null;

  if (subdomain) {
    projectSlug = subdomain;
  } else if (baseDomain) {
    const parts = baseDomain.split(".");
    // e.g. "navlokcolonizers.com" → "navlokcolonizers"
    // e.g. "webbuilder.local" → "webbuilder"
    projectSlug = parts[0];
  } else if (isLocal) {
    // For localhost/projectName
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    projectSlug = firstSegment || null;
  }

  // ==========================================================
  // 🚫 Skip Next.js internals & public/static routes
  // ==========================================================
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ==========================================================
  // 🔒 Admin/User route protection
  // ==========================================================
  if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const response = NextResponse.redirect(loginUrl);

      // Clear cookies
      for (const cookie of cookies.getAll()) {
        response.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
      }
      return response;
    }

    const roleRoutes: Record<string, string[]> = {
      "1": ["/admin"], // Admin
      "2": ["/user"], // User
    };

    if (role && roleRoutes[role]) {
      const allowed = roleRoutes[role].some((r) => pathname.startsWith(r));

      if (!allowed) {
        const redirectTo = role === "1" ? "/admin/users" : "/user/enquiry";
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }
    } else {
      const fallbackUrl = new URL("/administrator", request.url);
      return NextResponse.redirect(fallbackUrl);
    }

    return NextResponse.next();
  }

  // ==========================================================
  // 🌐 Handle Subdomain or Domain-based Project Routing
  // ==========================================================
  if (projectSlug && projectSlug !== "www") {
    const url = request.nextUrl.clone();

    // If local, remove project slug from the path
    const newPath =
      isLocal && pathname.startsWith(`/${projectSlug}`)
        ? pathname.replace(`/${projectSlug}`, "")
        : pathname;

    url.pathname = `/site/${projectSlug}${newPath}`;
    return NextResponse.rewrite(url);
  }

  // ==========================================================
  // ✅ Default — Allow normal routes
  // ==========================================================
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // ignore static assets
};
