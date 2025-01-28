import { createContext, useContext } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IReference } from "~lib/types"

interface IReferenceContext {
  references: IReference[]
  setReferences: (
    args: IReference[] | ((prev: IReference[]) => void)
  ) => Promise<void>
  storageLoading: boolean
}

const Reference = createContext<IReferenceContext>(null)

export default function ReferenceProvider({ children }) {
  const [references, setReferences, { isLoading: storageLoading }] = useStorage(
    {
      key: "fetch-references",
      instance: new Storage({
        area: "local"
      })
    },
    (v: IReference[]) => (!v ? [] : v)
  )

  const context = { references, setReferences, storageLoading }

  return <Reference.Provider value={context}>{children}</Reference.Provider>
}

export const useReference = () => useContext(Reference)
