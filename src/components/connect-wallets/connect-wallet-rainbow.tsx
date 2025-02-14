import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        const ready = mounted
        const connected = ready && account && chain
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none"
              }
            })}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="bg-white p-2 rounded-2xl border border-black hover:bg-black hover:text-white transition duration-300"
                    onClick={openConnectModal}
                    type="button">
                    Connect Wallet
                  </button>
                )
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="p-2 rounded-2xl border border-black text-rose-500 hover:bg-black transition duration-300"
                    onClick={openChainModal}
                    type="button">
                    Wrong network
                  </button>
                )
              }
              return (
                <div className="flex gap-2">
                  <button
                    className="flex justify-center items-center gap-0 sm:gap-2 p-2 rounded-2xl border border-black hover:bg-black hover:text-white transition duration-300"
                    onClick={openChainModal}
                    type="button">
                    {chain.hasIcon && (
                      <div>
                        {chain.iconUrl && (
                          <img
                            className="hidden sm:flex w-4 h-4"
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button
                    className="flex items-center gap-2 p-2 rounded-2xl border
                    border-black hover:bg-black hover:text-white transition
                    duration-300"
                    onClick={openAccountModal}
                    type="button">
                    {account.displayName}
                    {/* {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""} */}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
