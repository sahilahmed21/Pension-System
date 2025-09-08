"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogIn, LogOut, User } from "lucide-react";

/**
 * A client-side component for connecting and disconnecting a user's wallet.
 * It uses Wagmi hooks to manage the wallet connection state and provides
 * a user-friendly interface for interaction.
 * @returns {React.ReactElement} The rendered ConnectWalletButton component.
 */
export function ConnectWalletButton() {
    const { address, isConnected, isConnecting } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    // We are only using the injected (MetaMask) connector for this example
    const injectedConnector = connectors.find((c) => c.id === "injected");

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "";

    if (isConnected) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {shortAddress}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => disconnect()} className="text-red-500 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Disconnect</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button
            onClick={() => injectedConnector && connect({ connector: injectedConnector })}
            disabled={isConnecting}
        >
            <LogIn className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
    );
}
