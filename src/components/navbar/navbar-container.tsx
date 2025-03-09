import { PiGear } from "react-icons/pi"

import ConnectMobileWallet from "~components/connect-wallet/connect-mobile-wallet"
import CreateWallet from "~components/connect-wallet/create-wallet"
import FetchLogo from "~components/ui/fetch-logo"

export default function NavbarContainer({ isDev = false }) {
  return (
    <nav className="relative w-full h-12 flex items-center justify-center">
      <div className="w-full h-full bg-indigo-50 border-b border-fetch-primary flex p-1">
        <div className="flex-auto h-full flex gap-2 flex items-center">
          <FetchLogo />
        </div>
        <div className="flex gap-2 items-center">
          <ConnectMobileWallet />
          <CreateWallet />
          <a
            href={isDev ? "/options" : "/options.html"}
            rel="noopener noreferrer"
            target="_blank"
            className="h-full w-10 border border-fetch-primary text-fetch-primary px-2 rounded-xl text-sm flex items-center justify-center text-3xl hover:bg-violet-200">
            <PiGear />
          </a>
        </div>
      </div>
    </nav>
  )
}
