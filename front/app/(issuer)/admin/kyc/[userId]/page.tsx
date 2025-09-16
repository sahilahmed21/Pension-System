"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// Define a type for our submission data
type Submission = {
    id: string;
    created_at: string;
    fullName: string;
    dateOfBirth: string;
    nationalId: string;
    status: 'pending' | 'approved' | 'rejected';
};

export default function AdminKycDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchSubmission = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3001/user/submissions/${userId}`);
                setSubmission(response.data);
            } catch (err) {
                setError('Failed to load submission details.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmission();
    }, [userId]);

    const handleApprove = async () => {
        if (!submission) return;
        setIsProcessing(true);
        try {
            // This is the data that will become the credential
            const credentialData = {
                pensionerStatus: "Verified",
                kycLevel: "Full",
                fullName: submission.fullName,
            };

            // Call the issuer endpoint to trigger the on-chain and IPFS operations
            const response = await axios.post('http://localhost:3001/issuer/issue', {
                userId: submission.id,
                credentialData,
            });

            toast.success('Credential Issued!', {
                description: `Tx Hash: ${response.data.transactionHash}`,
            });
            router.push('/admin/kyc'); // Redirect back to the queue
        } catch (err) {
            toast.error('Failed to issue credential.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-40 w-full" /></CardContent>
                </Card>
            </div>
        );
    }

    if (error || !submission) {
        return <p className="text-destructive">{error || "Submission not found."}</p>;
    }

    return (
        <div className="space-y-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin/kyc"><ArrowLeft className="mr-2 h-4 w-4" />Back to KYC Queue</Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Review Application: {submission.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(submission.created_at).toLocaleString()}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="font-mono text-xs">
                        <h3 className="font-semibold text-base mb-2">Personal Information</h3>
                        <div className="flex justify-between py-2 border-b"><span>Full Name</span><span>{submission.fullName}</span></div>
                        <div className="flex justify-between py-2 border-b"><span>Date of Birth</span><span>{new Date(submission.dateOfBirth).toLocaleDateString()}</span></div>
                        <div className="flex justify-between py-2"><span>National ID</span><span>{submission.nationalId}</span></div>
                    </div>
                    <div className="font-mono text-xs">
                        <h3 className="font-semibold text-base mb-2">Submitted Documents</h3>
                        <Button variant="secondary">View Identity Document</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
                <Button variant="destructive" disabled={isProcessing}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                </Button>
                <Button onClick={handleApprove} disabled={isProcessing}>
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve & Issue VC
                </Button>
            </div>
        </div>
    );
}