import { useState } from "react"

import { Section } from "~components/ui/typograrphy"

import ImportShare from "./import-share"
import StoreShare from "./store-share"

export default function Share() {
  const [tab, setTab] = useState<"share" | "import">("share")

  return (
    <Section title={"Share to public"}>
      <div className="flex gap-2">
        <button
          onClick={() => setTab("share")}
          className={`w-full text-black/90 border rounded-xl py-2 ${tab === "share" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
          Share to public
        </button>
        <button
          onClick={() => setTab("import")}
          className={`w-full text-black/90 border rounded-xl py-2 ${tab === "import" ? "border-fetch-primary bg-violet-50" : "border-black/15 hover:bg-zinc-500/10"} `}>
          Import by id
        </button>
      </div>
      {tab === "share" && <StoreShare />}
      {tab === "import" && <ImportShare />}
    </Section>
  )
}
