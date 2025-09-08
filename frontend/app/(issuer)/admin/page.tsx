import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Users, FileCheck, Clock } from "lucide-react";

/**
 * The main dashboard page for the issuer/admin panel.
 * It displays key statistics and an overview of system activity.
 * @returns {React.ReactElement} The rendered admin dashboard page.
 */
export default function AdminDashboardPage() {
    const stats = [
        { title: "Pending KYC", value: "12", icon: Clock },
        { title: "Verified Users", value: "1,482", icon: Users },
        { title: "Certificates Issued", value: "1,390", icon: FileCheck },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Issuer Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome! Here's an overview of the system.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div>
                {/* Placeholder for recent activity or charts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Activity log will be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
