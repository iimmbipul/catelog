import { NextResponse, type NextRequest } from "next/server";

/* Clerk UserButton owns the real sign-out flow. If anything still hits
 * /admin/logout, bounce it through Clerk's hosted sign-out. */
function bye(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/sign-out";
  return NextResponse.redirect(url, { status: 303 });
}

export const GET = bye;
export const POST = bye;
