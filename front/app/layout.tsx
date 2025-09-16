import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/app/providers/theme-provider";
import { Web3Provider } from "@/app/providers/web3-provider";
import AuthProvider from "@/app/providers/auth0-provider"; // <-- Import Auth0 provider
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Pension Certificate System",
  description:
    "A secure, blockchain-based system for managing digital pension certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap everything in the AuthProvider */}
        <AuthProvider>
          <Web3Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-center" />
            </ThemeProvider>
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  );
}