import { Header } from "@/components/layout/header";

/**
 * Layout for the authentication section of the application (e.g., onboarding).
 * It provides a consistent structure with a header for these pages.
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
        </div>
    );
}
