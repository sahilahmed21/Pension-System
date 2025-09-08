import { KycForm } from "../../../components/features/kyc-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";

/**
 * The onboarding page for new users.
 * It guides the user through the KYC (Know Your Customer) process.
 * @returns {React.ReactElement} The rendered onboarding page.
 */
export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Identity Verification</CardTitle>
                    <CardDescription>
                        To issue your digital pension certificate, we need to verify your
                        identity. Please complete the steps below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <KycForm />
                </CardContent>
            </Card>
        </div>
    );
}
