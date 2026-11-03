import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/* Everything under /admin requires a signed-in Clerk user. The old
 * /admin/login + /admin/logout routes exist only to bounce visitors to the
 * Clerk-hosted auth pages (and are themselves public). */
const isAdminProtected = createRouteMatcher([
  "/admin((?!/login|/logout).*)",
  "/admin",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminProtected(req)) {
    await auth.protect();
  }
});

/* Only these routes read the session. Leaving the storefront out keeps Clerk off
 * the request path for shoppers, so cached pages are served directly. */
export const config = {
  matcher: ["/account", "/admin/:path*", "/sign-in/:path*", "/sign-up/:path*", "/__clerk/:path*"],
};
