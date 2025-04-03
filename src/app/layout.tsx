
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Providers } from "../context/Provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhaka University Student Portal",
  description:
    "A platform for Dhaka University students to share reviews and connect",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
