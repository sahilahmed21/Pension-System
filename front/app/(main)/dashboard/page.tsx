import { VCCard, VCCardProps } from "../../../components/features/vc-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Rocket } from "lucide-react";

/**
 * The main dashboard page for an authenticated pensioner.
 * It provides a summary of their status and a list of their credentials.
 * @returns {React.ReactElement} The rendered dashboard page.
 */
export default function DashboardPage() {
    // This data would typically come from an API call
    const user = {
        name: "Jane Doe",
        verificationStatus: "Verified",
    };

    const credentials: VCCardProps[] = [
        {
            type: "Pensioner Status Credential",
            issuer: {
                name: "Government of Trustland",
                logoUrl: "https://placehold.co/40x40/000000/FFFFFF?text=GT",
            },
            issuanceDate: "2023-10-26",
            status: "active",
        },
        {
            type: "Digital Pension Certificate",
            issuer: {
                name: "National Pension Authority",
                logoUrl: "https://placehold.co/40x40/E879F9/FFFFFF?text=NP",
            },
            issuanceDate: "2024-01-15",
            status: "active",
        },
        {
            type: "Proof of Address",
            issuer: {
                name: "Municipal Office",
                logoUrl: "https://placehold.co/40x40/3B82F6/FFFFFF?text=MO",
            },
            issuanceDate: "2022-05-20",
            status: "revoked",
        },
    ];

    return (
        <div className="container py-10">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here is an overview of your digital identity and credentials.
                    </p>
                </div>

                <Alert>
                    <Rocket className="h-4 w-4" />
                    <AlertTitle>You're all set!</AlertTitle>
                    <AlertDescription>
                        Your identity has been verified and your pension certificate is active. You can now securely share your credentials.
                    </AlertDescription>
                </Alert>

                <div>
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">My Credentials</h2>
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {credentials.map((cred) => (
                            <VCCard key={cred.type} {...cred} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
