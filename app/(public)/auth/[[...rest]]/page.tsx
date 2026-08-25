import AuthClient from "@/components/AuthPage/AuthClient";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Nexus is a modern real-time messaging platform built for seamless conversations. Designed for speed, privacy, and simplicity.",
};

export default function AuthPage() {
  return (
    <Suspense>
      <AuthClient />
    </Suspense>
  );
}
