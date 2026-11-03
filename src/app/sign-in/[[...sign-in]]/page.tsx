import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Sign in");

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkProvider>
        <SignIn />
      </ClerkProvider>
    </div>
  );
}
