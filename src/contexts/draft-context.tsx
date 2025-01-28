import { createContext, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IDraft } from "~lib/types"

interface IDraftContext {
  drafts: IDraft[]
  setDrafts: (args: IDraft[] | ((prev: IDraft[]) => void)) => Promise<void>
  storageLoading: boolean
}

const Draft = createContext<IDraftContext>(null)

export default function DraftProvider({ children }) {
  const [
    drafts,
    setDrafts,
    { isLoading: storageLoading, remove: removeDrafts }
  ] = useStorage(
    {
      key: "middle-drafts",
      instance: new Storage({
        area: "local"
      })
    },
    (v: IDraft[]) => (!v ? [] : v)
  )

  // useEffect(() => {
  //   if (drafts.length) {
  //     removeDrafts()
  //   }
  // }, [drafts])

  const context = { drafts, setDrafts, storageLoading }

  return <Draft.Provider value={context}>{children}</Draft.Provider>
}

export const useDraft = () => useContext(Draft)
