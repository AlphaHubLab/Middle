import { createContext, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IDraft } from "~lib/types"

interface IDraftContext {
  drafts: IDraft[]
  setDrafts: (args: IDraft[] | ((prev: IDraft[]) => void)) => Promise<void>
  storageLoading: boolean
}

const Drafting = createContext({} as IDraftContext)

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

  // console.log(() => remove())
  // uncomment the following lines to reset storage and
  // refresh the page with cmd + r ~ 7-8 times

  // useEffect(() => {
  //   if (drafts.length) {
  //     remove()
  //   }
  // }, [drafts])

  const context = { drafts, setDrafts, storageLoading }

  return <Drafting.Provider value={context}>{children}</Drafting.Provider>
}

export const useDraftContext = () => useContext(Drafting)
