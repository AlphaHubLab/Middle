import React, { useEffect } from "react"

import { isTaskEmpty } from "~lib/task-helpers"
import type { Store } from "~lib/types"

export default function useDraft(
  store: Store,
  drafts: any[],
  setDraft: (args: any) => void,
  storageLoading: boolean,
  delay: number = 500
) {
  const [debounceLoading, setDebounceLoading] = React.useState(false)

  useEffect(() => {
    if (isTaskEmpty(store)) return

    setDebounceLoading(true)

    const timer = setTimeout(() => {
      const _drafts = [...drafts]
      const found = _drafts.find((d) => d.id === store.id)

      if (found) {
        found.task = store.task
        found.params = store.params
      } else {
        _drafts.push({ id: store.id, task: store.task, params: store.params })
      }

      setDebounceLoading(false)
      setDraft(_drafts)
    }, delay)

    return () => clearTimeout(timer)
  }, [store, delay])

  return { isLoading: storageLoading || debounceLoading }
}
