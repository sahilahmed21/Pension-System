import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function AdminNav() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Dashboard
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/admin/kyc" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            KYC Queue
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {/* We can add a settings link later if needed */}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="border-b">
                {/* The container class centers this navigation bar */}
                <div className="container flex h-14 items-center justify-between">
                    <AdminNav />
                    <Button>New Issuance</Button>
                </div>
            </div>
            <main className="flex-1 bg-muted/40 p-4 md:p-8">
                {/* The container class here centers the main content and gives it a max-width */}
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
}

