import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { FileText, Share2 } from "lucide-react";
import { cn } from "../../lib/utils";

export type VCCardProps = {
    type: string;
    issuer: {
        name: string;
        logoUrl?: string;
    };
    issuanceDate: string;
    status: "active" | "revoked" | "pending";
};

/**
 * A reusable component to display a Verifiable Credential.
 * It presents credential details in a clean, organized card format.
 *
 * @param {VCCardProps} props - The properties for the credential card.
 * @returns {React.ReactElement} The rendered VC Card component.
 */
export function VCCard({ type, issuer, issuanceDate, status }: VCCardProps) {
    const statusVariant = {
        active: "default",
        revoked: "destructive",
        pending: "secondary",
    } as const;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>{type}</CardTitle>
                    <CardDescription>Issued on {issuanceDate}</CardDescription>
                </div>
                <div className="ml-auto">
                    <Badge variant={statusVariant[status]} className="capitalize">
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={issuer.logoUrl} alt={`${issuer.name} logo`} />
                        <AvatarFallback>{issuer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">Issued By</p>
                        <p>{issuer.name}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-end space-x-2">
                    <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                    <Button size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
