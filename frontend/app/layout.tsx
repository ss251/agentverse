import "./globals.css";
import type { Metadata } from "next";
import { Web3ModalProvider } from "./lib/Web3Modal";
import { Header } from "./ui/Header";
import { ThemeProvider } from "next-themes";
import { Bricolage_Grotesque } from "next/font/google";
import { Syne } from "next/font/google";
import { cn } from "./ui/v0/lib/utils";

export const metadata: Metadata = {
  title: "agentverse",
  description: "agentverse ai nft marketplace",
};

const fontHeading = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <Web3ModalProvider>
          <ThemeProvider attribute="class">
            <main className="min-h-screen">
              <Header />
              {children}
            </main>
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
