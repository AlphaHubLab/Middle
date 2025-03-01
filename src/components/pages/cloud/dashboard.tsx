import FetchProvider from "~providers/fetch-provider"
import { useState } from "react"

import { Section } from "~components/ui/typograrphy"

import SelfBackup from "./backup"
import Share from "./share"

export default function Dashboard({ isDev = false }) {
  const [page, setPage] = useState<"backup" | "share" | "activity">("share")

  return (
    <FetchProvider isDev={isDev}>
      <div className="w-full max-w-[650px] mx-auto p-4">
        <div className="text-sm gap-2 w-full flex justify-around">
          <button
            onClick={() => setPage("backup")}
            className={`w-full text-black/90 border rounded-xl py-2 ${page === "backup" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
            Backup
          </button>
          <button
            onClick={() => setPage("share")}
            className={`w-full text-black/90 border rounded-xl py-2 ${page === "share" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
            Share
          </button>
          <button
            onClick={() => setPage("activity")}
            className={`w-full text-black/90 border rounded-xl py-2 ${page === "activity" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
            Activity
          </button>
        </div>
        {page === "backup" && <SelfBackup />}
        {page === "share" && <Share />}
        {page === "activity" && <Activity />}
      </div>
    </FetchProvider>
  )
}

const Activity = () => {
  return <Section title={"Activity"}>Activity</Section>
}
