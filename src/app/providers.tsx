'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'Trustline',
        }),
    ],
    transports: {
        [baseSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={baseSepolia}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}