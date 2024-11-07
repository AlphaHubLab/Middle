import React, { useEffect, useRef } from "react"

import { isTaskEmpty } from "~lib/task-helpers"
import type { Store } from "~lib/types"

const isEqual = require("react-fast-compare")

export default function useDraft(
  store: Store,
  drafts: any[],
  setDraft: (args: any) => void,
  storageLoading: boolean,
  delay: number = 500
) {
  const [debounceLoading, setDebounceLoading] = React.useState(false)

  const task = useRef(store.task)
  const params = useRef(store.params)

  useEffect(() => {
    // Prevent drafting while changing focus or range
    if (
      isEqual(store.params, params.current) &&
      isEqual(store.params, params.current)
    ) {
      return
    }

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

      task.current = store.task
      params.current = store.params
      setDebounceLoading(false)
      setDraft(_drafts)
    }, delay)

    return () => clearTimeout(timer)
  }, [store, delay])

  return { isLoading: storageLoading || debounceLoading }
}
