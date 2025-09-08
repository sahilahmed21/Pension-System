import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { Switch } from "../../../components/ui/switch";

/**
 * The settings page for the user to manage their profile and security options.
 * @returns {React.ReactElement} The rendered settings page.
 */
export default function SettingsPage() {
    const user = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        avatarUrl: "https://github.com/shadcn.png",
        walletAddress: "0x1234...5678",
    };

    return (
        <div className="container py-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and security settings.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold">Profile</h2>
                    <p className="text-sm text-muted-foreground">Update your personal information.</p>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-medium">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.walletAddress}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user.name} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user.email} />
                                </div>
                                <Button className="mt-2">Update Profile</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Separator className="my-8" />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold">Security</h2>
                    <p className="text-sm text-muted-foreground">Enhance your account security.</p>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biometric Login (WebAuthn)</CardTitle>
                            <CardDescription>
                                Enable passwordless login using your device's biometrics (e.g., Touch ID, Face ID, Windows Hello).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <Label htmlFor="biometric-switch" className="font-medium">
                                    Enable Biometric Login
                                </Label>
                                <Switch id="biometric-switch" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
