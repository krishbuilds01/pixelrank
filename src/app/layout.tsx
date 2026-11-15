import type { Metadata } from "next";
import { Press_Start_2P, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const pixel = Press_Start_2P({ variable: "--font-pixel", subsets: ["latin"], weight: "400" });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const jet = JetBrains_Mono({ variable: "--font-jet", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelRank - see where you stand",
  description: "One leaderboard for LeetCode, Codeforces and CodeChef. Start with your college, then go global.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixel.variable} ${space.variable} ${jet.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink">
        <Nav />
        {children}
      </body>
    </html>
  );
}
