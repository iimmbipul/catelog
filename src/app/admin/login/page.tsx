import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "./actions";
import { Logo } from "@/components/site/Logo";

export const metadata = { title: "Admin — Sign in" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLogin({ searchParams }: Props) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-cocoa-700 text-ivory-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10">
          <Logo />
        </div>
        <div className="rounded-3xl bg-ivory-50 p-8 text-cocoa-700 shadow-card">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-serif text-3xl">Sign in.</h1>
          {error && (
            <p className="mt-4 rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-500">
              Wrong username or password.
            </p>
          )}
          <form action={loginAction} className="mt-8 space-y-4" autoComplete="off">
            <div>
              <label className="eyebrow">Username</label>
              <input
                name="username"
                autoComplete="off"
                required
                className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
              />
            </div>
            <div>
              <label className="eyebrow">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
              />
            </div>
            <button className="mt-2 w-full rounded-full bg-cocoa-700 py-3.5 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
