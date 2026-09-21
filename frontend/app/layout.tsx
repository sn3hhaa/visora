import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const serifFont = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VISORA — Practice the conversation before it becomes real",
  description:
    "A premium conversational interview platform. Realistic sessions that adapt to your answers, challenge vague responses, and show you how you communicate under pressure.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1A1916] font-sans antialiased selection:bg-[#2C332A] selection:text-[#FAF8F5]">
        {children}
      </body>
    </html>
  );
}
