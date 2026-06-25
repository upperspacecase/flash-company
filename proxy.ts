import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/dashboard(.*)", "/api/prompts(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

// Only the admin surface needs Clerk. Running the middleware on every route put
// the dev-instance "dev-browser" handshake (a third-party accounts.dev redirect)
// in front of the public invite route /s — so on browsers that block
// SameSite=None cookies the handshake kept retrying, reloading the join page and
// wiping the form. Scope it to the routes that actually require auth.
export const config = {
  matcher: ["/dashboard(.*)", "/api/prompts(.*)"],
};
