import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const token = cookies.get("admin_token")?.value;

  const host = request.headers.get("host") || "";
  const cleanHost = host.split(":")[0]; // strip :3000
  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("webbuilder.local");

  // ------------------ Domain setup ------------------
  const MAIN_DOMAIN = "baaraat.com";
  const LOCAL_DEV_DOMAIN = "webbuilder.local";
  const VERCEL_DOMAIN = "website-builder-frontend-three.vercel.app";
  const LOCAL_DOMAINS = ["localhost:3000", "webbuilder.local:3000"];

  const baseDomains = [MAIN_DOMAIN, VERCEL_DOMAIN, LOCAL_DEV_DOMAIN, ...LOCAL_DOMAINS];
  const baseDomain = baseDomains.find((d) => cleanHost.endsWith(d));
  const subdomain = baseDomain ? cleanHost.replace(`.${baseDomain}`, "") : null;

  // ------------------ Skip static assets ------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  // ------------------ Allow main domains home & admin access ------------------
  if (
    cleanHost === MAIN_DOMAIN ||
    cleanHost === `www.${MAIN_DOMAIN}` ||
    cleanHost === LOCAL_DEV_DOMAIN ||
    LOCAL_DOMAINS.includes(host)
  ) {
    // ✅ Admin route auth check
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/administrator") ||
      pathname.startsWith("/user")
    ) {
      if (!token && pathname !== "/administrator") {
        const loginUrl = new URL("/administrator", request.url);
        const res = NextResponse.redirect(loginUrl);

        // clear all cookies if unauthenticated
        cookies.getAll().forEach((c) =>
          res.cookies.set(c.name, "", { path: "/", maxAge: 0 })
        );
        return res;
      }
    }

    // ✅ Home route `/` or any public path — allow free access
    return NextResponse.next();
  }

  // ------------------ Subdomains for projects ------------------
  // Example: jaipurfoodcaterers.webbuilder.local / navlok.baaraat.com
if (
  [MAIN_DOMAIN, LOCAL_DEV_DOMAIN].includes(baseDomain?.toLowerCase().replace(/\.$/, "")) &&
  subdomain &&
  subdomain.toLowerCase() !== "www"
) {
  // console.log("🌀 Rewriting for subdomain:", subdomain);
  const url = request.nextUrl.clone();

  // ✅ Ensure clean path joining (avoid double slashes)
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  url.pathname = `/site/${subdomain}${cleanPath}`;

  // console.log("➡️ Rewrite to:", url.pathname);
  return NextResponse.rewrite(url);
}


  // ------------------ Custom external domains ------------------
  // Example: jaipurfoodcaterers.com → acts like jaipurfoodcaterers.baaraat.com
  if (
    !baseDomain &&
    !cleanHost.endsWith(MAIN_DOMAIN) &&
    !cleanHost.endsWith(VERCEL_DOMAIN) &&
    !cleanHost.endsWith(LOCAL_DEV_DOMAIN)
  ) {
    const projectSlug = cleanHost.replace(/^www\./, "").split(".")[0].toLowerCase();
    const url = request.nextUrl.clone();
    url.pathname = `/site/${projectSlug}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ------------------ Vercel / fallback handling ------------------
  if (isLocal || host === VERCEL_DOMAIN || LOCAL_DOMAINS.includes(host)) {
    return NextResponse.next();
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|uploads|.*\\..*).*)"],
};
