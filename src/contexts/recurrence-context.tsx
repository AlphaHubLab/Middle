import { createContext, useContext } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IRecurrence } from "~lib/types"

interface IRecurrenceContext {
  recurrences: IRecurrence[]
  setRecurrences: (
    args: IRecurrence[] | ((prev: IRecurrence[]) => void)
  ) => Promise<void>
  storageLoading: boolean
}

const Recurrence = createContext<IRecurrenceContext>(null)

export default function RecurrenceProvider({ children }) {
  const [recurrences, setRecurrences, { isLoading: storageLoading }] =
    useStorage(
      {
        key: "fetch-recurrences",
        instance: new Storage({
          area: "local"
        })
      },
      (v: IRecurrence[]) => (!v ? [] : v)
    )

  const context = { recurrences, setRecurrences, storageLoading }

  return <Recurrence.Provider value={context}>{children}</Recurrence.Provider>
}

export const useRecurrence = () => useContext(Recurrence)
