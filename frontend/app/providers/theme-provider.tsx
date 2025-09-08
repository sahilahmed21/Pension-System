"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * A client-side component that provides theme context to its children.
 * It wraps the NextThemesProvider to enable light/dark mode functionality.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider.
 * @returns {React.ReactElement} The rendered ThemeProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
