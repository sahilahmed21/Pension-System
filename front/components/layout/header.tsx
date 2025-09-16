"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthenticationButton } from "@/components/shared/authentication-button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <ShieldCheck className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            PensionTrust
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <AuthenticationButton /> {/* <-- Use new button here */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}