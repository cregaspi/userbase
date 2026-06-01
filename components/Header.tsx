"use client";

import Link from "next/link";
import { Moon, Sun, Users } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="logo-icon">
            <Users size={15} color="white" strokeWidth={2.5} />
          </div>
          <span className="logo-text">User Base</span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="theme-toggle"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
