"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Menu,
  MessageCircle,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";

type NavigationItem = {
  name: string;
  href: string;
};

type FeatureItem = NavigationItem & {
  description: string;
  icon: typeof MessageCircle;
};

const navigation: NavigationItem[] = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const features: FeatureItem[] = [
  {
    name: "Real-time messaging",
    href: "/features",
    description: "Instant delivery with typing indicators",
    icon: MessageCircle,
  },
  {
    name: "Private conversations",
    href: "/features",
    description: "Secure conversations built for trust",
    icon: ShieldCheck,
  },
  {
    name: "Smart conversations",
    href: "/features",
    description: "Connect with people and groups",
    icon: Users,
  },
  {
    name: "Usage insights",
    href: "/features",
    description: "Understand activity at a glance",
    icon: BarChart3,
  },
];

const menuMotion = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFeaturesOpen(false);
        setIsMobileOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  function closeMobileNavigation() {
    setIsMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary navigation"
        className={`mx-auto mt-2 flex max-w-4xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 sm:px-6 ${
          isScrolled
            ? "border-primary-200/70 bg-primary-100/85 py-2 shadow-lg shadow-primary-900/5"
            : "border-transparent bg-primary-100 py-2 shadow-sm sm:py-3"
        }`}
      >
        <Link
          href="/"
          aria-label="Nexus home"
          className="relative block size-18 shrink-0 rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary-500 sm:size-18"
        >
          <Image
            src="/logo/nexus-logo.png"
            alt="Nexus"
            fill
            priority
            sizes="64px"
            className="object-contain"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setIsFeaturesOpen(true)}
            onMouseLeave={() => setIsFeaturesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={isFeaturesOpen}
              aria-controls="features-menu"
              className={`group cursor-pointer flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/features")
                  ? "text-primary-700"
                  : "text-text-700 hover:text-primary-700"
              }`}
              onClick={() => setIsFeaturesOpen((open) => !open)}
            >
              Features
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform duration-200 ${
                  isFeaturesOpen ? "rotate-180" : ""
                }`}
              />
              <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 bg-primary-500 transition-transform group-hover:scale-x-100" />
            </button>

            <AnimatePresence>
              {isFeaturesOpen && (
                <motion.div
                  id="features-menu"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={menuMotion}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-primary-200 bg-primary-100 p-3 shadow-xl shadow-primary-900/10"
                >
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                      Explore Nexus
                    </p>
                    <ArrowRight size={14} className="text-primary-500" aria-hidden="true" />
                  </div>
                  <div className="grid gap-1">
                    {features.map(({ name, description, href, icon: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        onClick={() => setIsFeaturesOpen(false)}
                        className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-primary-200/50 focus-visible:outline-2 focus-visible:outline-primary-500"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-200 text-primary-700 transition-transform group-hover:scale-105">
                          <Icon size={17} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-primary-900">
                            {name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-primary-900/65">
                            {description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navigation.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 ${
                isActive(href)
                  ? "text-primary-700"
                  : "text-text-700 hover:text-primary-700"
              }`}
            >
              {name}
              <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 bg-primary-500 transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggler />
          <Link
            href="/auth?mode=signup"
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-primary-50 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            Get started
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggler />
          <button
            type="button"
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            className="flex size-10 items-center justify-center rounded-xl bg-primary-300 text-primary-50 transition-colors hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-primary-500"
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            {isMobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 z-40 cursor-default bg-primary-950/35 lg:hidden"
              onClick={closeMobileNavigation}
            />
            <motion.aside
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col bg-primary-100 p-5 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-primary-200/70 pb-4">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="flex size-10 items-center justify-center rounded-xl text-primary-700 transition-colors hover:bg-primary-200 focus-visible:outline-2 focus-visible:outline-primary-500"
                  onClick={closeMobileNavigation}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col gap-2 py-6">
                <Link
                  href="/features"
                  onClick={closeMobileNavigation}
                  aria-current={isActive("/features") ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive("/features")
                      ? "bg-primary-200 text-primary-800"
                      : "text-text-700 hover:bg-primary-200/60"
                  }`}
                >
                  Features
                </Link>
                {navigation.map(({ name, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileNavigation}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive(href)
                        ? "bg-primary-200 text-primary-800"
                        : "text-text-700 hover:bg-primary-200/60"
                    }`}
                  >
                    {name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto border-t border-primary-200/70 pt-5">
                <Link
                  href="/auth?mode=signup"
                  onClick={closeMobileNavigation}
                  className="flex items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-primary-50 transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  Get started
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
