import { useState } from "react"

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
      {session && (
        <button
          disabled={isPending}
          onClick={() => signOut()}
          className="my-2 disabled:bg-zinc-400 text-white rounded-xl bg-red-700 hover:bg-red-800 px-2 py-1">
          {isPending ? "Singing out..." : "Sign out"}
        </button>
      )}
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
    </FetchProvider>
  )
}

const Activity = () => {
  return <Section title={"Activity"}>Activity</Section>
}
