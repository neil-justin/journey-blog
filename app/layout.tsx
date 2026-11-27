import type { Metadata } from "next";
import { Syncopate, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${syncopate.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
