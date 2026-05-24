"use client";

import Link from "next/link";
import { Moon, Sun, Users } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--canvas)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Users size={15} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--ink)" }}>
            User Base
          </span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-100"
          style={{
            color: "var(--ink-muted)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-2)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
          }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
