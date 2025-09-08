"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 1. Create a TanStack Query client
const queryClient = new QueryClient();

// 2. Create a Wagmi config
// Note: It's crucial to specify the chainId for the injected connector
// to avoid potential issues with wallet connection.
export const config = createConfig({
    chains: [mainnet, sepolia], // Add the chains you want to support
    connectors: [
        injected({
            // shimDisconnect: true is recommended for stability
            shimDisconnect: true,
        }),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});

/**
 * A client-side component that provides Web3 context to its children.
 * It sets up Wagmi and TanStack Query for wallet interactions.
 * @param {{ children: React.ReactNode }} props - The props containing child components.
 * @returns {React.ReactElement} The rendered Web3Provider component.
 */
export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
