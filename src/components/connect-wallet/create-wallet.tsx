import { useCallback } from "react"
import { useConnect } from "wagmi"

import { smartWalletConfig } from "~providers/web3-context"

import SmartWalletLogo from "./smart-wallet-logo"

export default function CreateWallet() {
  const { connectors, connect } = useConnect({ config: smartWalletConfig })

  const createWallet = useCallback(() => {
    connect({ connector: connectors[0] })
  }, [connectors, connect])

  return (
    <button
      className="bg-[#0052ff] h-full px-2 hover:bg-[#0052ff]/80 rounded-xl flex gap-2 text-white text-sm items-center justify-center"
      onClick={() => createWallet()}>
      Create wallet

        <SmartWalletLogo />

    </button>
  )
}
