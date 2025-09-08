import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * A page for an issuer to review the details of a specific KYC application.
 *
 * @param {{ params: { userId: string } }} props - Props containing the dynamic user ID.
 * @returns {React.ReactElement} The rendered KYC detail page.
 */
export default function KycDetailPage({ params }: { params: { userId: string } }) {
    // In a real app, fetch this data based on params.userId
    const applicationData = {
        id: params.userId,
        name: "John Smith",
        dateOfBirth: "1975-05-15",
        nationalId: "A12345678",
        submittedDate: "2024-03-10",
        documentUrl: "/path/to/document.pdf", // Placeholder
    };

    return (
        <div className="space-y-6">
            <Link href="/admin/kyc" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to KYC Queue
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Review Application: {applicationData.name}</CardTitle>
                    <CardDescription>
                        Submitted on {applicationData.submittedDate}. Please verify the following information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Full Name</span><span>{applicationData.name}</span></div>
                        <Separator />
                        <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{applicationData.dateOfBirth}</span></div>
                        <Separator />
                        <div className="flex justify-between"><span className="text-muted-foreground">National ID</span><span className="font-mono">{applicationData.nationalId}</span></div>
                    </div>
                    <h3 className="font-semibold pt-4">Submitted Documents</h3>
                    <Button variant="outline" asChild>
                        <a href={applicationData.documentUrl} target="_blank" rel="noopener noreferrer">View Identity Document</a>
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="destructive"><X className="mr-2 h-4 w-4" /> Reject</Button>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700"><Check className="mr-2 h-4 w-4" />Approve & Issue VC</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
