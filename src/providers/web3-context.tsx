// import "@rainbow-me/rainbowkit/styles.css"
// import {
//   connectorsForWallets,
//   RainbowKitProvider
// } from "@rainbow-me/rainbowkit"
// import {
//   coinbaseWallet,
//   injectedWallet,
//   rabbyWallet,
//   rainbowWallet,
//   walletConnectWallet
// } from "@rainbow-me/rainbowkit/wallets"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { createConfig, http, WagmiProvider } from "wagmi"
// import { base, mainnet, optimism } from "wagmi/chains"

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: "Recommended",
//       wallets: [
//         injectedWallet,
//         coinbaseWallet,
//         rabbyWallet,
//         rainbowWallet,
//         walletConnectWallet
//       ]
//     }
//   ],
//   {
//     appName: "My RainbowKit App",
//     projectId: "YOUR_PROJECT_ID"
//   }
// )

// const queryClient = new QueryClient()

// export const config = createConfig({
//   connectors,
//   chains: [mainnet, base],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http()
//   }
// })

// export default function Web3Provider({ children }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         {/* {children} */}
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// works for now
import { ConnectKitProvider } from "connectkit/build/index.es"
// import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { createConfig, http, WagmiProvider } from "wagmi"
import { base } from "wagmi/chains"
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors"

const config = createConfig({
  connectors: [
    coinbaseWallet({ preference: "eoaOnly" }),
    metaMask(),
    walletConnect({ projectId: "a" })
  ],
  chains: [base],
  transports: {
    [base.id]: http()
    // RPC URL for each chain
    //   [mainnet.id]: http(
    //     `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
    //   )
  }
  // walletConnectProjectId: process.env.PLASMO_PUBLIC_WALLETCONNECT_PROJECT_ID,
  // appName: "Your App Name",
  // appDescription: "Your App Description",
  // appUrl: "https://family.co", // your app's url
  // appIcon: "https://family.co/logo.png" // your app's icon, no bigger than 1024x1024px (max. 1MB)
})

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

export const defaultConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      ...coinbaseWalletConfig,
      preference: "eoaOnly"
    }),
    metaMask(),
    walletConnect({ projectId: "a" })
  ],
  transports: {
    [base.id]: http()
  }
})

const queryClient = new QueryClient()

export default function Web3Provider({ children }) {
  return (
    <WagmiProvider config={defaultConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
