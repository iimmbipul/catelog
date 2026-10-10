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

export const config = {
  matcher: [
    // Skip Next internals and all static files unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
