"use client";

import { useTypewriter } from "@/hooks/useTypeWriter";
import Link from "next/link";

const PHRASES = [
  "Connect instantly.\nTalk without limits.",
  "Private conversations.\nBuilt for trust.",
  "Fast messaging.\nBuilt to scale.",
  "Modern messaging.\nPowered by simplicity.",
  "Built for speed.\nDesigned for humans.",
  "End-to-end encrypted.\nYour privacy first.",
  "Real-time messaging.\nEngineered for scale.",
];

export function HeroLeft() {
  const { displayed, isDone } = useTypewriter({ phrases: PHRASES });
  const visible = isDone;

  const [line1 = "", line2 = ""] = displayed.split("\n");

  return (
    <div id="hero-content" className="flex flex-col gap-6">
      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-text-700 min-h-22 md:min-h-28 ">
        {line1}
        {line2 && (
          <>
            <br />
            <span className="text-primary-500 ">{line2}</span>
          </>
        )}

        {/* Cursor */}
        <span className="inline-block w-0.5 h-[0.85em] bg-primary-500 ml-1 align-middle rounded-sm animate-[blink_0.9s_step-end_infinite]" />
      </h1>

      {/* Subtitle */}
      <p
        className={`text-base leading-relaxed text-text-800 max-w-md transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        A modern messaging platform built for speed, privacy, and real-time
        collaboration. Chat securely, scale effortlessly.
      </p>

      {/* CTA */}
      <div
        className={`flex items-center gap-3 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <Link
          href="/auth?mode=signup"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-primary-50 text-sm font-medium  transition-all"
        >
          Get started free
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}