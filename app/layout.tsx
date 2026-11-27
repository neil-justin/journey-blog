import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const manrope = Manrope({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-inst",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neil Justin Mallari",
  description:
    "My journey as a computer science student — from 1st year to OJT. SE101 Final Project.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
