"use client";

import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

    if (!domain || !clientId) {
        throw new Error('Auth0 domain and client ID must be defined in .env.local');
    }

    const onRedirectCallback = (appState: any) => {
        router.push(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
}