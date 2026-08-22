import { cookies } from "next/headers";

const ADMIN_USER = "admin";
const ADMIN_PASS = "whiteandwick";
const COOKIE = "ww_admin";

export async function isAdmin() {
  const c = await cookies();
  return c.get(COOKIE)?.value === "yes";
}

export async function signIn(username: string, password: string) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const c = await cookies();
    c.set(COOKIE, "yes", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { ok: true };
  }
  return { ok: false as const, error: "Wrong username or password." };
}

export async function signOut() {
  const c = await cookies();
  c.delete(COOKIE);
}
