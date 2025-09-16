import { Button } from "../../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Lock, FileText } from "lucide-react";

/**
 * A dedicated page for viewing and managing the Digital Pension Certificate.
 * @returns {React.ReactElement} The rendered certificate page.
 */
export default function CertificatePage() {
    const certificateDetails = {
        certificateId: "PENS-CERT-2024-1A9B3C",
        holder: "Jane Doe",
        entitlement: "€2,500.00 / month",
        effectiveDate: "2024-01-01",
        paymentSchedule: "Monthly, on the 1st",
    };

    return (
        <div className="container py-10">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Pension Certificate</h1>
                    <p className="text-muted-foreground">
                        Manage and view your official pension certificate.
                    </p>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Certificate Overview</CardTitle>
                        <CardDescription>
                            This is your official, cryptographically-secured pension certificate.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            <Badge>Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Certificate ID</span>
                            <span className="font-mono text-sm">{certificateDetails.certificateId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Effective Date</span>
                            <span>{certificateDetails.effectiveDate}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Securely View Full Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Pension Certificate Details</DialogTitle>
                                    <DialogDescription>
                                        This information is confidential and was decrypted for this session.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 py-4">
                                    {Object.entries(certificateDetails).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
