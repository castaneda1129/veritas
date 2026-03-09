"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-mono text-sm font-black text-accent">
            V
          </div>
          <span className="font-mono text-lg font-bold tracking-[0.2em] text-foreground">
            VERITAS
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {/* Live indicator */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Live</span>
          </div>

          <nav className="flex gap-1">
            <Link
              href="/"
              className={`rounded-md px-3 py-1.5 font-mono text-sm font-medium transition ${
                pathname === "/"
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              Feed
            </Link>
            <Link
              href="/submit"
              className={`rounded-md px-3 py-1.5 font-mono text-sm font-medium transition ${
                pathname === "/submit"
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              + Submit
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
