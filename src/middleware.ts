import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;

  // ==========================================================
  // 🏠 Extract domain, subdomain, and normalize www
  // ==========================================================
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0]; // remove port number (e.g., localhost:3000 → localhost)
  const isLocal = host === "localhost" || host === "127.0.0.1";

  // ✅ Redirect www. → non-www (SEO-friendly)
  if (host.startsWith("www.")) {
    const nonWwwUrl = new URL(request.url);
    nonWwwUrl.host = host.replace("www.", "");
    return NextResponse.redirect(nonWwwUrl);
  }

  // Define allowed base domains
  const baseDomains = [
    "webbuilder.local",
    "lvh.me",
    "doomshell.com",
    "localhost",
    "website-builder-frontend-three.vercel.app",
    "navlokcolonizers.com",
  ];

  // Find base domain match
  const baseDomain = baseDomains.find((d) => host.endsWith(d));

  // Extract subdomain (e.g., demo.webbuilder.local → demo)
  let subdomain =
    baseDomain && host !== baseDomain
      ? host.replace(`.${baseDomain}`, "")
      : null;

  // Ignore "www" explicitly
  if (subdomain === "www") subdomain = null;

  // Derive the project slug:
  // - subdomain if exists (e.g., demo)
  // - or base domain prefix (e.g., navlokcolonizers)
  // - or first path segment (for localhost/projectSlug)
  let projectSlug: string | null = null;

  if (subdomain) {
    projectSlug = subdomain;
  } else if (baseDomain) {
    const parts = baseDomain.split(".");
    projectSlug = parts[0]; // e.g., navlokcolonizers.com → "navlokcolonizers"
  } else if (isLocal) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    projectSlug = firstSegment || null;
  }

  // ==========================================================
  // 🚫 Skip Next.js internals & static files
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

      // Clear cookies on logout
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
  // 🌐 Domain/Subdomain → /site/[projectSlug] Rewrite
  // ==========================================================
  if (projectSlug && projectSlug !== "www") {
    const url = request.nextUrl.clone();

    // Remove slug prefix for localhost URLs
    const newPath =
      isLocal && pathname.startsWith(`/${projectSlug}`)
        ? pathname.replace(`/${projectSlug}`, "")
        : pathname;

    url.pathname = `/site/${projectSlug}${newPath}`;
    return NextResponse.rewrite(url);
  }

  // ==========================================================
  // ✅ Default — Allow all other routes
  // ==========================================================
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // Ignore static files
};
