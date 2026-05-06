import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoLyrics — Guess the Song, Feel the Memory",
  description:
    "A poetic Hindi song guessing game. Read beautiful English reinterpretations of iconic Bollywood lyrics, guess the song, and relive the magic.",
  keywords: ["Hindi songs", "Bollywood", "music quiz", "lyrics game", "nostalgia"],
  openGraph: {
    title: "EchoLyrics",
    description: "Guess the song. Feel the memory.",
    type: "website",
  },
};

import AuthProvider from "@/components/AuthProvider";
import OnboardingModal from "@/components/OnboardingModal";
import TopNav from "@/components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a
          href="https://www.linkedin.com/in/vivekk52/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/60 hover:text-white transition-colors duration-300 drop-shadow-md hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          aria-label="LinkedIn Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <AuthProvider>
          <OnboardingModal />
          <TopNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
