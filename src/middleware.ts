import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  // ==========================================================
  // 🏠 Get host and subdomain
  // ==========================================================
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0]; // remove port (e.g., localhost:3000 → localhost)

  const baseDomains = ["webbuilder.local", "lvh.me", "doomshell.com", "https://website-builder-frontend-three.vercel.app/"];
  const baseDomain = baseDomains.find((d) => host.endsWith(d));
  const subdomain = baseDomain ? host.replace(`.${baseDomain}`, "") : null;

  const isLocal = host === "localhost" || host === "127.0.0.1";

  // ==========================================================
  // 🚫 Skip Next.js internals, static files, and auth pages
  // ==========================================================
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    // pathname.startsWith("/administrator") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }
  if (subdomain == "webbuilder.local") {
    return NextResponse.next();
  }

  // ==========================================================
  // 🔒 Admin/User route protection
  // ==========================================================
  if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
    if (!token) {
      const loginUrl = new URL("/administrator", request.url);
      const response = NextResponse.redirect(loginUrl);

      // clear all cookies on logout
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
  // 🌐 Handle Subdomain or Localhost Routing
  // ==========================================================
  if (
    (baseDomain && subdomain && subdomain !== "www") ||
    (isLocal && pathname.split("/").filter(Boolean).length > 0)
  ) {
    const projectSlug = subdomain || pathname.split("/")[0];
    const url = request.nextUrl.clone();

    console.log();


    // Remove project slug from pathname if on localhost
    const newPath =
      isLocal && pathname.startsWith(`/${projectSlug}`)
        ? pathname.replace(`/${projectSlug}`, "")
        : pathname;

    url.pathname = `/site/${projectSlug}${newPath}`;
    return NextResponse.rewrite(url);
  }

  // ==========================================================
  // ✅ Default — Allow public routes
  // ==========================================================
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // ignore static assets
};
