import { useState } from "react"

import { Section } from "~components/ui/typograrphy"

import RestoreBackup from "./restore-backup"
import StoreBackup from "./store-backup"

export default function SelfBackup() {
  const [tab, setTab] = useState<"store" | "restore">("store")

  const [backups, setBackups] = useState([])
  const [fetched, setFetched] = useState(false)

  return (
    <Section title={"Backup for myself"}>
      <div className="flex gap-2">
        <button
          onClick={() => setTab("store")}
          className={`w-full text-black/90 border rounded-xl py-2 ${tab === "store" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
          Store Backup
        </button>
        <button
          onClick={() => setTab("restore")}
          className={`w-full text-black/90 border rounded-xl py-2 ${tab === "restore" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
          Restore Backup
        </button>
      </div>
      {tab === "store" && <StoreBackup />}
      {tab === "restore" && (
        <RestoreBackup
          backups={backups}
          setBackups={setBackups}
          fetched={fetched}
          setFetched={setFetched}
        />
      )}
    </Section>
  )
}
