"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ClerkSignIn from "@/components/AuthPage/ClerkSignIn";
import ClerkSignUp from "@/components/AuthPage/ClerkSignUp";

type AuthMode = "signin" | "signup";

function modeFromParam(value: string | null): AuthMode {
  return value === "signup" ? "signup" : "signin";
}

export default function AuthClient() {
  const searchParams = useSearchParams();
  const currentMode = modeFromParam(searchParams.get("mode"));
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setMode(nextMode: AuthMode) {
    if (nextMode === currentMode) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("mode", nextMode);
    startTransition(() => {
      router.replace(`/auth?${nextParams.toString()}`, { scroll: false });
    });
  }

  return (
    <section className="flex w-full flex-1 items-center justify-center bg-background-50 px-3 py-6 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-background-200/80 bg-background-50/85 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">

        {/* LEFT: Brand & Image */}
        <div className="relative hidden lg:min-h-152 bg-primary-100/70 p-10 lg:flex lg:flex-col lg:p-14">
          <div className="relative z-10 max-w-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              Welcome to Nexus
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-text-800 lg:text-4xl">
              Conversations that feel close, wherever you are.
            </h1>
            <p className="mt-4 text-sm leading-6 text-text-500">
              Sign in to continue your conversations or create an account in a
              few moments.
            </p>
          </div>
          <div className="relative mt-auto h-64 w-full lg:h-72">
            <Image
              src="/ui-photos/signin.png"
              alt="People connecting through Nexus"
              fill
              sizes="(max-width: 1024px) 0vw, 45vw"
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Authentication */}
        <div className="flex min-w-0 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full">

            {/* Toggle Buttons */}
            <div
              aria-label="Authentication mode"
              className="mx-auto mb-7 grid w-full max-w-60 sm:max-w-xs grid-cols-2 gap-x-2 rounded-xl border border-primary-200/70 bg-primary-50 p-1"
              role="tablist"
            >
              {(["signin", "signup"] as const).map((tab) => {
                const isActive = currentMode === tab;
                const label = tab === "signin" ? "Sign in" : "Sign up";

                return (
                  <button
                    key={tab}
                    aria-selected={isActive}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary-100 text-primary-900 shadow-sm"
                        : "text-text-500 hover:text-text-700 hover:bg-primary-200/40"
                    }`}
                    disabled={isPending}
                    onClick={() => setMode(tab)}
                    role="tab"
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Forms — fixed min-height so Sign In / Sign Up never shift the card */}
            <div className="min-h-88 sm:min-h-104 lg:min-h-128 w-full flex justify-center" aria-live="polite">
              {currentMode === "signin" ? <ClerkSignIn /> : <ClerkSignUp />}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}