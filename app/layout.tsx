import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Jotion",
  description: "The connected Workspace where better , faster works happen ",
  icons: [
    {
      media: "(prefers-color-scheme : light)",
      url: "/logo.svg",
      href: "/logo.svg",
    },
    {
      media: "(prefers-color-scheme :dark)",
      url: "/logo-dark.svg",
      href: "/logo-dark.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} antialiased dark:bg-[#161618]`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="jotion-theme-2"
          >
            <Toaster position="bottom-center"/>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
