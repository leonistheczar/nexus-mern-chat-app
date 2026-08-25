import type { Metadata } from "next";
import "./main.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import ThemeProviderWrapper from "@/lib/providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "Nexus",
    template: "%s | Nexus",
  },
  description:
    "Nexus is a modern real-time messaging platform built for seamless conversations. Designed for speed, privacy, and simplicity.",

    icons: {
      // --- General browser icons ---
      icon: [
        { url: "/favicons/favicon-16x16.png",  sizes: "16x16",  type: "image/png" },
        { url: "/favicons/favicon-32x32.png",  sizes: "32x32",  type: "image/png" },
        { url: "/favicons/favicon-48x48.png",  sizes: "48x48",  type: "image/png" },
        { url: "/favicons/favicon-64x64.png",  sizes: "64x64",  type: "image/png" },
      ],
  
      // --- Apple touch icons ---
      apple: [
        { url: "/favicons/favicon-57x57.png",  sizes: "57x57"  },
        { url: "/favicons/favicon-60x60.png",  sizes: "60x60"  },
        { url: "/favicons/favicon-152x152.png",sizes: "152x152"},
        { url: "/favicons/favicon-180x180.png",sizes: "180x180"}, // most important
      ],
  
      // --- Shortcut (legacy browsers) ---
      shortcut: "/favicons/favicon-32x32.png",
  
      // --- Windows Metro tiles ---
      other: [
        {
          rel: "msapplication-TileImage",
          url: "/favicons/favicon-150x150.png", // 150x150 = standard Windows tile
        },
        {
          rel: "msapplication-square310x310logo",
          url: "/favicons/favicon-310x310.png",
        },
      ],
    },
  // ✅ Extra (optional but good)
  applicationName: "Nexus",
  keywords: [
    "chat app",
    "real-time messaging",
    "Nexus",
    "secure chat",
    "MERN chat app",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="geist-font min-h-screen flex flex-col bg-primary-200/20 text-primary-900 antialiased">
          <ClerkProvider>
          <QueryProvider>
            <ThemeProviderWrapper>
              {children}
            </ThemeProviderWrapper>
          </QueryProvider>
          </ClerkProvider>
      </body>
    </html>
  );
}
