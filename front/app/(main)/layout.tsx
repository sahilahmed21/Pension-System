"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isConnected, isConnecting } = useAccount();

    // In a real app, this status would come from a backend API call
    const [onboardingStatus, setOnboardingStatus] = useState<"loading" | "complete" | "incomplete">("loading");

    useEffect(() => {
        // Simulate fetching user status after connecting
        if (isConnected) {
            setTimeout(() => {
                // MOCK: Pretend this user has completed onboarding
                setOnboardingStatus("complete");
            }, 1000);
        } else if (!isConnecting) {
            setOnboardingStatus("incomplete");
        }
    }, [isConnected, isConnecting]);


    // This effect handles the routing logic
    useEffect(() => {
        if (onboardingStatus === 'loading' || isConnecting) {
            return;
        }

        if (!isConnected) {
            router.replace("/");
        } else if (onboardingStatus === 'incomplete') {
            router.replace("/onboarding");
        }

    }, [isConnected, isConnecting, onboardingStatus, router]);


    // Render a loading state while we check authentication
    if (isConnecting || onboardingStatus === 'loading') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Verifying your status...</p>
            </div>
        );
    }

    // If checks pass, render the full layout
    if (isConnected && onboardingStatus === 'complete') {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="border-b">
                    <div className="container">
                        <Tabs defaultValue="/dashboard" className="h-14">
                            <TabsList>
                                <Link href="/dashboard"><TabsTrigger value="/dashboard">Dashboard</TabsTrigger></Link>
                                <Link href="/certificate"><TabsTrigger value="/certificate">Certificate</TabsTrigger></Link>
                                <Link href="/settings"><TabsTrigger value="/settings">Settings</TabsTrigger></Link>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <main className="flex-1 bg-muted/40 p-4 md:p-8">
                    <div className="container">
                        {children}
                    </div>
                </main>
            </div>
        );
    }

    return null;
}