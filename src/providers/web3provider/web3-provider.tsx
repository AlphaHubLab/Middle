import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createConfig, http, WagmiProvider } from "wagmi"
import { base, mainnet } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

const queryClient = new QueryClient()

const coinbaseWalletConfig = {
  appName: "Fetch",
  appLogoUrl: "https://example.com/myLogoUrl.png"
}

export const smartWalletConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      ...coinbaseWalletConfig,
      preference: "smartWalletOnly"
    })
  ],
  transports: {
    [base.id]: http()
  }
})

export const otherConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      ...coinbaseWalletConfig,
      preference: "eoaOnly"
    }),
    walletConnect({ projectId: "a" })
  ],
  transports: {
    [base.id]: http()
  }
})

export default function Web3ProviderMain({ children }) {
  return (
    <WagmiProvider config={otherConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
