"use client";
import { useState, useEffect } from "react";

import { Container } from "./Container";
import { NavLink } from "./NavLink";
import MobileNavigation from "./MobileNavigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ConnectWallet } from "./ConnectWallet";
import { HeaderSkeleton } from "./HeaderSkeleton";

export function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="py-10 bg-background-light dark:bg-background-dark">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src={"/logo.png"}
                  alt="agentverse logo"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="/launch">Launch</NavLink>
              <NavLink href="/explore">Explore</NavLink>
              <NavLink href="/my-agents">My Agents</NavLink>
              <NavLink href="/knowledge-base">Knowledge Base</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <ConnectWallet />
            </div>
            {/* <ThemeToggle /> */}
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
