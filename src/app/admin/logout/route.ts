import { NextResponse, type NextRequest } from "next/server";
import { signOut } from "@/lib/auth";

async function bye(req: NextRequest) {
  await signOut();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url, { status: 303 });
}

export const POST = bye;
export const GET = bye;
