// utils/auth.ts
import Cookies from "js-cookie";

/** * Set a cookie with standard options * @param key Cookie name * @param value Cookie value
 *  * @param options Optional cookie options */
const setCookie = (key: string, value: string, options?: Partial<Cookies.CookieAttributes>) => {
  const isSecure = window.location.protocol === "https:";
  Cookies.set(key, value, {
    expires: 1,           // default 1 day
    secure: isSecure,     // true on HTTPS
    sameSite: "Lax",
    path: "/",
    ...options,
  });
};

/*** Get a cookie value by key */
const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

/*** Remove a cookie */
const removeCookie = (key: string) => {
  Cookies.remove(key, { path: "/" });
};

/* === Auth Functions === */
/** Save admin token */
export const setToken = (token: string) => setCookie("admin_token", token);

/** Get admin token */
export const getToken = (): string | undefined => getCookie("admin_token");

/** Save schema slug */
export const setSchema = (schema: string) => setCookie("schema", schema);

/** Get schema slug */
export const getSchema = (): string | undefined => getCookie("schema");

/** Save schema slug */
export const setFolder = (folder: string) => setCookie("image_folder", folder);

/** Get schema slug */
export const getFolder = (): string | undefined => getCookie("image_folder");

/** Save company logo */
export const setLogo = (logo: string) => setCookie("company_logo", logo);

/** Get company logo */
export const getLogo = (): string | undefined => getCookie("company_logo");

/** Save Role Id */
export const setRole = (role: string) => setCookie("role", role);

/** Get Role Id */
export const getRole = (): string | undefined => getCookie("role");

/** Remove all auth cookies */
export const removeAuthToken = () => {
  removeCookie("admin_token");
  removeCookie("schema");
  removeCookie("company_logo");
  removeCookie("role");
  removeCookie("image_folder");
};

/**
 * Logout user
 * Clears cookies and redirects to login page
 * Also disables browser back button to prevent navigating back after logout
 */
// export const logout = (redirectUrl: string = "/administrator") => {
//   removeAuthToken();
//   // Disable browser back button
//   window.history.pushState(null, "", window.location.href);
//   window.onpopstate = () => window.history.go(1);
//   // Redirect to login page
//   window.location.href = redirectUrl;
// };

export const logout = (redirectUrl: string = "/administrator", callback?: () => void) => {
  // Remove auth token
  removeAuthToken();

  // Prevent browser back navigation
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", window.location.href);
    const preventBack = () => window.history.forward();
    window.addEventListener("popstate", preventBack);

    // Redirect after a tiny delay to ensure back-button handler is in place
    setTimeout(() => {
      window.location.href = redirectUrl;
      // Call optional callback
      callback?.();
    }, 50);
  } else {
    // Fallback if window is undefined (SSR)
    callback?.();
  }
};