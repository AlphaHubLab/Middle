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
//   chains: [mainnet, optimism, base],
//   transports: {
//     [mainnet.id]: http(),
//     [optimism.id]: http(),
//     [base.id]: http()
//   }
// })

// export default function Web3Provider({ children }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }
