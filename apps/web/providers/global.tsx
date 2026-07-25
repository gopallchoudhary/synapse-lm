"use client";

import type { ServerRouter } from "@repo/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useState } from "react";
import { Toaster } from "~/components/ui/toast";
import { TRPCProvider } from "~/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";

import { ClerkProvider } from '@clerk/nextjs'

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnMount: true,
                        staleTime: Infinity,
                    },
                },
            }),
    );

    const [trpcClient] = useState(() =>
        createTRPCClient<ServerRouter>({
            links: [createTRPCHttpBatchClientClient()],
        }),
    );

    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </NextThemesProvider>
                </TRPCProvider>
            </QueryClientProvider>
        </ClerkProvider>
    );
};
