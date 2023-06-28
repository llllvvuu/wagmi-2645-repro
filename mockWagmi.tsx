import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { localhost } from "@wagmi/chains"
import { connect, disconnect } from "@wagmi/core"
import React  from "react"
import { createWalletClient, http } from "viem"
import { privateKeyToAccount } from 'viem/accounts'
import { configureChains, WagmiConfig, createConfig, type Address } from "wagmi"
import { MockConnector } from "wagmi/connectors/mock"
import { publicProvider } from "wagmi/providers/public"

import type { ReactNode } from "react"

const { chains, publicClient } = configureChains(
  [localhost],
  [publicProvider()]
)

const KEY1: Address =
  process.env.WALLET1_PRIVATE_KEY as Address | undefined
    ?? "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
const mockConnector = new MockConnector({
  chains: [localhost],
  options: {
    walletClient: createWalletClient({
      account: privateKeyToAccount(KEY1),
      transport: http(localhost.rpcUrls.public.http[0]),
    }),
  },
})

export const mockWagmiConfig = createConfig({
  connectors: [mockConnector],
  publicClient,
})

const queryClient = new QueryClient()

export const mockWrapper: React.FunctionComponent<{
  children?: ReactNode,
}> =
  ({ children }) => (
    <WagmiConfig config={mockWagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )

export const mockConnect =
  async () => await connect({ connector: mockConnector })

export const mockDisconnect = disconnect
