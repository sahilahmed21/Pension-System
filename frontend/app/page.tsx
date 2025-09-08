"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function LandingPage() {
  const { isConnected } = useAccount();

  // The button's destination changes based on wallet connection status
  const getStartedLink = isConnected ? "/dashboard" : "/onboarding";

  const features = [
    { title: "Immutable Security", description: "Leveraging blockchain technology to prevent fraud and tampering." },
    { title: "User Sovereignty", description: "You are in full control of your digital identity and your data." },
    { title: "Instant Verification", description: "Third parties like banks can verify your status in seconds, not days." },
    { title: "Reduced Costs", description: "Streamlines administrative processes, reducing overhead for all parties." },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          {/* This container div centers the content */}
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  The Future of Pension Verification is Here
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  PensionTrust provides a secure, decentralized, and efficient system for issuing and verifying digital pension certificates.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href={getStartedLink}>Get Started</Link>
                </Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          {/* This container div centers the content */}
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A New Paradigm of Trust and Efficiency</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system is built on four core principles to redefine how pension data is managed and verified.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center p-6 border-t">
        <p className="text-sm text-muted-foreground">&copy; 2025 PensionTrust. All rights reserved.</p>
      </footer>
    </div>
  );
}