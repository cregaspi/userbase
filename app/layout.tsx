import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "User Base",
  description: "Browse and filter users by name, username, email, or company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="app-shell">
            <Header />
            <main className="flex-1 mb-30">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}