"use client";

import { SignIn } from "@clerk/nextjs";

export default function ClerkSignIn() {
  return (
    <SignIn
      path="/auth"
      routing="path"
      signUpUrl="/auth?mode=signup"
    />
  );
}
