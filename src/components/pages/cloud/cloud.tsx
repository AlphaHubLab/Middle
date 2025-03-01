import { useModal, useSIWE, type SIWESession } from "connectkit"
import { useAuth } from "~providers/auth-provider"
import CloudProvider from "~providers/cloud-provider"
import { useAccount, useDisconnect } from "wagmi"

import { FETCH_API } from "~fetch.config"

export default function Cloud() {
  return (
    <CloudProvider>
      <div>
        <CustomSIWEButton />
      </div>
    </CloudProvider>
  )
}

export const CustomSIWEButton = () => {
  const { setOpen } = useModal()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { jwt } = useAuth()

  const authPost = async () => {
    // if (!jwt) return console.log("nope")
    const res = await fetch(`${FETCH_API}/do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jwt })
    })
    if (!res.ok) {
      console.log("cannot")
    }
    if (res.ok) {
      const json = await res.json()
      console.log(json)
    }
  }

  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } =
    useSIWE({
      onSignIn: (session?: SIWESession) => {
        console.log(session)
        // Do something with the data
      },
      onSignOut: () => {
        disconnect()
        // Do something when signed out
      }
    })

  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWESession) => {
      // Do something when signed in
    })
  }

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      disconnect()
      // Do something when signed out
    })
  }

  /** Wallet is connected and signed in */
  if (isSignedIn) {
    return (
      <>
        <button onClick={() => authPost()}>do</button>
        <div>Address: {data?.address}</div>
        <div>ChainId: {data?.chainId}</div>
        <button onClick={handleSignOut}>Sign Out</button>
      </>
    )
  }

  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <>
        <button onClick={() => authPost()}>do</button>
        <button onClick={handleSignIn} disabled={isLoading}>
          {isRejected // User Rejected
            ? "Try Again"
            : isLoading // Waiting for signing request
              ? "Awaiting request..."
              : // Waiting for interaction
                "Sign In"}
        </button>
      </>
    )
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <button onClick={() => authPost()}>do</button>
      <button onClick={() => setOpen(true)}>Connect Wallet</button>
    </>
  )
}
