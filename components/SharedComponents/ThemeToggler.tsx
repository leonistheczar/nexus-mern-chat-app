"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Guard against SSR hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []); 

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
        rounded-full bg-primary-200 overflow-hidden
        transition-all hover:cursor-pointer hover:bg-primary-300
      "
    >
      {/* Sun */}
      <Sun
        size={18}
        className={`
          absolute transition-all duration-500 ease-in-out delay-150
          ${isDark
            ? "opacity-0 rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"}
        `}
      />

      {/* Moon */}
      <Moon
        size={18}
        className={`
          absolute transition-all duration-500 ease-in-out delay-150
          ${isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75"}
        `}
      />
    </button>
  );
}