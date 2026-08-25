"use client";

import { SignUp } from "@clerk/nextjs";

export default function ClerkSignUp() {
  return (
    <SignUp
      path="/auth"
      routing="path"
      signInUrl="/auth?mode=signin"
    />
  );
}
