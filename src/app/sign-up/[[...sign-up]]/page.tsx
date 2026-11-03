import { ClerkProvider, SignUp } from "@clerk/nextjs";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Create account");

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkProvider>
        <SignUp />
      </ClerkProvider>
    </div>
  );
}
