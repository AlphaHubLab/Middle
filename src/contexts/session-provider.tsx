import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  ConnectKitProvider,
  getDefaultConfig,
  SIWEProvider,
  type SIWEConfig
} from "connectkit"
import { useCallback, useMemo } from "react"
import { createSiweMessage } from "viem/siwe"
import { createConfig, http, WagmiProvider } from "wagmi"
import { base, mainnet } from "wagmi/chains"

// import ConnectWallets from "~components/connect-wallets/connect-wallet"
// import FetchProvider from "~contexts/fetch-provider"
import { FETCH_API } from "~fetch.config"

import { useAuth } from "./auth-provider"

// const siweConfig: SIWEConfig = {
//   getNonce: async () => {
//     console.log("get nonce")
//     return fetch(`${FETCH_API}/auth/siwe/nonce`).then((res) => res.text())
//   },
//   createMessage: ({ nonce, address, chainId }) => {
//     console.log("creat message")
//     return createSiweMessage({
//       version: "1",
//       domain: window.location.host,
//       uri: window.location.origin,
//       address,
//       chainId,
//       nonce,
//       statement: "Sign in With Ethereum."
//     })
//   },
//   nonceRefetchInterval: 60 * 1000,
//   verifyMessage: async ({ message, signature }) => {
//     console.log("to verify")

//     return fetch(`${FETCH_API}/auth/siwe/verify`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ message, signature })
//     }).then((res) => res.ok)
//   },

//   getSession: async () => {
//     console.log("to get session")
//     return fetch(`${FETCH_API}/auth/siwe/session`).then((res) =>
//       res.ok ? res.json() : null
//     )
//   },
//   signOut: async () =>
//     fetch(`${FETCH_API}/auth/siwe/signout`).then((res) => res.ok)
// }

const config = createConfig(
  getDefaultConfig({
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
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png" // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

export default function SessionProvider({ children }) {
  console.log("rerender")
  const { jwt, setJwt } = useAuth()

  // const getSession = useCallback(async () => {
  //   console.log("to get session")
  //   if (!jwt) return null
  //   console.log(jwt)
  //   console.log("get session")
  //   return fetch(`${FETCH_API}/auth/siwe/session`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ jwt })
  //   }).then((res) => (res.ok ? res.json() : null))
  // }, [jwt])

  const getSession = async () => {
    console.log("to get session")
    // if (!jwt) return null
    console.log(jwt)
    console.log("get session")
    return fetch(`${FETCH_API}/auth/siwe/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jwt })
    }).then((res) => (res.ok ? res.json() : null))
  }

  const signOut = useCallback(async () => {
    console.log("call sign out")

    const res = await fetch(`${FETCH_API}/auth/siwe/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jwt })
    })

    if (res.ok) {
      console.log("signed out!")
      setJwt("")
      return true
    }
    return false
  }, [jwt])

  const verifyMessage = async ({ message, signature }) => {
    if (jwt) return true
    const res = await fetch(`${FETCH_API}/auth/siwe/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, signature })
    })

    if (res.ok) {
      const { jwt: newJwt } = await res.json()
      setJwt(newJwt)
      return true
    }

    setJwt("")
    return false
  }

  const siweConfig_ = {
    getNonce: async () =>
      fetch(`${FETCH_API}/auth/siwe/nonce`).then((res) => res.text()),
    createMessage: ({ nonce, address, chainId }) =>
      createSiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        statement: "Sign in With Ethereum."
      })
    // verifyMessage: async ({ message, signature }) => {
    //   const res = await fetch(`${FETCH_API}/auth/siwe/verify`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ message, signature })
    //   })

    //   if (res.ok) {
    //     const { jwt: newJwt } = await res.json()
    //     setJwt(newJwt)
    //     return true
    //   }

    //   setJwt("")
    //   return false
    // }

    // getSession:
    // async () => {
    //   console.log("to get session")
    //   if (!jwt) return null
    //   console.log(jwt)
    //   console.log("get session")
    //   return fetch(`${FETCH_API}/auth/siwe/session`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ jwt })
    //   }).then((res) => (res.ok ? res.json() : null))
    // },

    // signOut: async () => {
    //   console.log("call sign out")

    //   const res = await fetch(`${FETCH_API}/auth/siwe/signout`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ jwt })
    //   })

    //   if (res.ok) {
    //     console.log("signed out!")
    //     setJwt("")
    //     return true
    //   }
    //   return false
    // }
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <SIWEProvider {...siweConfig}> */}
        <SIWEProvider
          createMessage={siweConfig_.createMessage}
          verifyMessage={verifyMessage}
          getSession={getSession}
          signOut={signOut}
          getNonce={siweConfig_.getNonce}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
