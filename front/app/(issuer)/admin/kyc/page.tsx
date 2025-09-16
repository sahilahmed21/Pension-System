"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// This defines the structure of the data we expect from our API
type Submission = {
    id: string;
    created_at: string;
    fullName: string;
    status: 'pending' | 'approved' | 'rejected';
};

export default function AdminKycQueuePage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:3001/user/submissions');
                // Clean the 'status' field to remove extra quotes if they exist and ensure correct typing
                const cleanedData: Submission[] = response.data.map((s: any) => ({
                    ...s,
                    status: (typeof s.status === 'string' ? s.status.replace(/'/g, '') : s.status) as Submission['status']
                }));
                setSubmissions(cleanedData);
                setError(null);
            } catch (err) {
                setError('Failed to load submissions from the server.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    const filteredSubmissions = (status: Submission['status']) =>
        submissions.filter(s => s.status === status);

    const renderTable = (data: Submission[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    data.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.fullName}</TableCell>
                            <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/kyc/${submission.id}`}>Review</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            No submissions in this category.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">KYC Queue</h2>
                    <p className="text-muted-foreground">
                        Review and process new identity verification requests.
                    </p>
                </div>
            </div>
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <Card>
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : error ? (
                            <p className="text-destructive">{error}</p>
                        ) : (
                            <>
                                {/* FIX: Render all TabsContent blocks directly */}
                                <TabsContent value="pending">
                                    {renderTable(filteredSubmissions('pending'))}
                                </TabsContent>
                                <TabsContent value="approved">
                                    {renderTable(filteredSubmissions('approved'))}
                                </TabsContent>
                                <TabsContent value="rejected">
                                    {renderTable(filteredSubmissions('rejected'))}
                                </TabsContent>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Tabs>
        </>
    );
}

