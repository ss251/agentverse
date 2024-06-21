import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { walletConfig } from "./lib/walletConfig";
import Web3ModalProvider from "./context/Web3ModalProvider";
import { Header } from "./ui/Header";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "agentverse",
  description: "agentverse ai nft marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    walletConfig,
    headers().get("cookie")
  );

  return (
    <html lang="en">
      <body className="bg-gradient-radial from-accent to-secondary text-primary-light">
        <Web3ModalProvider initialState={initialState}>
          <ThemeProvider attribute="class">
            <main className="flex-grow">
              <Header />
              {children}
            </main>
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
