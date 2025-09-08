"use client";

// Note: The shadcn/ui DataTable is not a single component but a recipe.
// For a real project, you would build out the columns.tsx, data-table.tsx, etc.
// Here, we'll simulate its appearance within a Card for simplicity.
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";

const kycApplications = [
    { id: 'usr_1', name: 'John Smith', submitted: '2024-03-10', status: 'pending' },
    { id: 'usr_2', name: 'Emily White', submitted: '2024-03-09', status: 'pending' },
    { id: 'usr_3', name: 'David Green', submitted: '2024-03-08', status: 'approved' },
    { id: 'usr_4', name: 'Sarah Black', submitted: '2024-03-07', status: 'rejected' },
];

/**
 * A page for issuers to manage the queue of KYC applications.
 * It uses tabs to filter applications by status.
 * @returns {React.ReactElement} The rendered KYC queue page.
 */
export default function KycQueuePage() {
    const renderTable = (status: "pending" | "approved" | "rejected") => {
        const filteredApps = kycApplications.filter(app => app.status === status);
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApps.length > 0 ? filteredApps.map(app => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.name}</TableCell>
                            <TableCell>{app.submitted}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/admin/kyc/${app.id}`}>
                                    <Button variant="outline" size="sm">Review</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No applications in this category.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>KYC Verification Queue</CardTitle>
                <CardDescription>
                    Review and process new identity verification requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending <Badge className="ml-2">2</Badge></TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">{renderTable("pending")}</TabsContent>
                    <TabsContent value="approved">{renderTable("approved")}</TabsContent>
                    <TabsContent value="rejected">{renderTable("rejected")}</TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
