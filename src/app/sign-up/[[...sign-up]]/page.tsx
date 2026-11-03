import { ClerkProvider, SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkProvider>
        <SignUp />
      </ClerkProvider>
    </div>
  );
}
