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
// import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { createConfig, http, WagmiProvider } from "wagmi"
import { base, mainnet } from "wagmi/chains"

// works for now
import {
  ConnectKitProvider,
  getDefaultConfig
} from "../../node_modules/connectkit/build/index.es"

// export const config = createConfig({
//   connectors: [rabbyWallet],
//   chains: [mainnet, base],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http()
//   }
// })

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, base],
    transports: {
      [mainnet.id]: http(),
      [base.id]: http()
      // RPC URL for each chain
      //   [mainnet.id]: http(
      //     `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      //   )
    },

    // Required API Keys
    walletConnectProjectId: process.env.PLASMO_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png" // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

export default function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
