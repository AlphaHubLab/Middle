import React from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IDraft } from "~lib/types"

interface SetDraftContext {
  setDrafts: (args: IDraft[]) => Promise<void>
  storageLoading: boolean
}

interface GetDraftContext {
  drafts: IDraft[]
}

const DraftSetter = React.createContext({} as SetDraftContext)
const DraftGetter = React.createContext({} as GetDraftContext)

export default function DraftProvider({ children }) {
  const [drafts, setDrafts, { isLoading: storageLoading }] = useStorage(
    {
      key: "middle-drafts",
      instance: new Storage({
        area: "local"
      })
    },
    (v: IDraft[]) => (!v ? [] : v)
  )

  return (
    <DraftSetter.Provider value={{ setDrafts, storageLoading }}>
      <DraftGetter.Provider value={{ drafts }}>{children}</DraftGetter.Provider>
    </DraftSetter.Provider>
  )
}

export const useSetDraft = () => React.useContext(DraftSetter)
export const useGetDraft = () => React.useContext(DraftGetter)
