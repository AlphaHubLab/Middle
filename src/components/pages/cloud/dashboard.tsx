import { useState } from "react"
import { PiArrowLeft, PiArrowRight } from "react-icons/pi"

import { Section } from "~components/ui/typograrphy"
import FetchProvider from "~providers/fetch-provider"
import { useSession } from "~providers/session-provider"

import SelfBackup from "./backup/backup"
import Share from "./share/share"

export default function Dashboard({ isDev = false }) {
  const [page, setPage] = useState<"backup" | "share" | "activity">("backup")

  const { signOut, session, isPending } = useSession()

  return (
    <FetchProvider isDev={isDev}>
      <div className="bg-slate-100 w-full">
        <div className="relative h-full transition-[width] w-[calc(100%-64px)] md:w-[calc(100%-286px)] ml-[64px] md:ml-[286px]">
          <div className="w-full max-w-[650px] px-2 mx-auto">
            {session && (
              <button
                disabled={isPending}
                onClick={() => signOut()}
                className="my-2 disabled:bg-zinc-400 text-white rounded-xl bg-red-700 hover:bg-red-800 px-2 py-1">
                {isPending ? "Singing out..." : "Sign out"}
              </button>
            )}
            <Sidebar>
              {/* <div>a</div>
              <div>a</div>
              <div>a</div> */}
              <button
                onClick={() => setPage("backup")}
                className={`my-2 w-full text-black/90 border rounded-xl py-2 ${page === "backup" ? "border-fetch-primary bg-violet-50 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Backup
              </button>
              <button
                onClick={() => setPage("share")}
                className={`my-2 w-full text-black/90 border rounded-xl py-2 ${page === "share" ? "border-fetch-primary bg-fetch-secondary/40 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Share
              </button>
              <button
                onClick={() => setPage("activity")}
                className={`my-2 w-full text-black/90 border rounded-xl py-2 ${page === "activity" ? "border-fetch-primary bg-fetch-secondary/40 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Activity
              </button>
            </Sidebar>
            <div className="text-sm gap-2 w-full flex justify-around">
              {/* <button
                onClick={() => setPage("backup")}
                className={`w-full text-black/90 border rounded-xl py-2 ${page === "backup" ? "border-fetch-primary bg-violet-50 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Backup
              </button>
              <button
                onClick={() => setPage("share")}
                className={`w-full text-black/90 border rounded-xl py-2 ${page === "share" ? "border-fetch-primary bg-fetch-secondary/40 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Share
              </button>
              <button
                onClick={() => setPage("activity")}
                className={`w-full text-black/90 border rounded-xl py-2 ${page === "activity" ? "border-fetch-primary bg-fetch-secondary/40 text-fetch-primary/90" : "border-black/15 hover:bg-zinc-500/10"} `}>
                Activity
              </button> */}
            </div>
            {page === "backup" && <SelfBackup />}
            {page === "share" && <Share />}
            {page === "activity" && <Activity />}
          </div>
        </div>
      </div>
    </FetchProvider>
  )
}

const Activity = () => {
  return <Section title={"Activity"}>Activity</Section>
}

const Sidebar = ({ isDev = false, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`fixed h-[calc(100%-3rem)] py-1 md:pl-1 p-0 top-12 left-0 w-[286px] transition-[margin-left] duration-200 z-20 ${isOpen ? "ml-0" : "-ml-[222px] md:ml-0"}`}>
      <div
        className={`relative w-full h-full px-1 md:px-2 ${isOpen && "px-2"} z-30 bg-white shadow-none border rounded-r-3xl md:rounded-3xl border-transparent md:shadow-lg md:border-black/15`}>
        <div className="w-full h-full">
          <div className="h-[calc(100%-200px)] py-2">{children}</div>
        </div>
        <div
          className={`w-full md:px-2 ${isOpen && "px-2"} flex absolute bottom-1 left-0 pr-1 justify-end`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
            className="hover:bg-violet-100 visible md:hidden w-[54px] h-[54px]
              flex items-center justify-center md:w-full bg-slate-50 border border-violet-900
              rounded-2xl text-2xl text-fetch-primary">
            {isOpen ? <PiArrowLeft /> : <PiArrowRight />}
          </button>
        </div>
      </div>
      {/* <div
        onClick={() => setIsOpen(true)}
        className={`w-full h-full block absolute top-0 left-0 md:hidden z-50 ${!isOpen && "bg-transparent hover:bg-white/50"}`}></div> */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed w-full h-full top-0 left-0 bg-black/20"></div>
      )}
    </div>
  )
}
