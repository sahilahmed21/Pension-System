"use client"; // Add this directive to mark as a Client Component

import { useState } from "react"; // Import useState
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

// In a real app, you would fetch verification data based on the `id` param
// and manage loading/error states. Here we simulate it.
type VerificationStatus = "verified" | "failed" | "pending";

/**
 * A public-facing page for third parties to verify a credential.
 * It displays the result of a cryptographic verification process.
 *
 * @param {{ params: { id: string } }} props - The props containing the dynamic route parameter.
 * @returns {React.ReactElement} The rendered verification page.
 */
export default function VerifyPage({ params }: { params: { id: string } }) {
    // FIX: Use the `useState` hook to manage component state.
    // This is the idiomatic React way and resolves the TypeScript error.
    const [status, setStatus] = useState<VerificationStatus>("verified"); // Change to "failed" or "pending" to see other states

    const verificationData = {
        credentialType: "Digital Pension Certificate",
        holder: "Jane Doe",
        issuer: "National Pension Authority",
        issuanceDate: "2024-01-15",
        verificationDate: new Date().toUTCString(),
    };

    const renderStatus = () => {
        switch (status) {
            case "verified":
                return (
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-green-800 dark:text-green-300">Verification Successful</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400">
                            The credential has been successfully verified on the blockchain.
                        </AlertDescription>
                    </Alert>
                );
            case "failed":
                return (
                    <Alert variant="destructive">
                        <XCircle className="h-5 w-5" />
                        <AlertTitle>Verification Failed</AlertTitle>
                        <AlertDescription>
                            This credential could not be verified. It may be invalid, revoked, or tampered with.
                        </AlertDescription>
                    </Alert>
                );
            case "pending":
            default:
                return (
                    <Alert>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <AlertTitle>Verifying Credential...</AlertTitle>
                        <AlertDescription>
                            Please wait while we perform cryptographic checks against the ledger.
                        </AlertDescription>
                    </Alert>
                );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Credential Verification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderStatus()}
                    {status === 'verified' && (
                        <div className="space-y-2 text-sm">
                            <h3 className="font-semibold text-lg mb-4">Verified Details</h3>
                            <div className="flex justify-between"><span className="text-muted-foreground">Credential Type</span><span>{verificationData.credentialType}</span></div>
                            <Separator />
                            <div className="flex justify-between"><span className="text-muted-foreground">Holder</span><span>{verificationData.holder}</span></div>
                            <Separator />
                            <div className="flex justify-between"><span className="text-muted-foreground">Issuer</span><Badge variant="secondary">{verificationData.issuer}</Badge></div>
                            <Separator />
                            <div className="flex justify-between"><span className="text-muted-foreground">Issuance Date</span><span>{verificationData.issuanceDate}</span></div>
                            <Separator />
                            <div className="flex justify-between"><span className="text-muted-foreground">Verified On</span><span>{verificationData.verificationDate}</span></div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

