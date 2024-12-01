import React from "react"
import isEqual from "react-fast-compare"

import { useSetDraft } from "~contexts/drafting-context"
import type { Store } from "~lib/types"

export default function useDrafting(store: Store, delay: number = 1000) {
  const [debounceLoading, setDebounceLoading] = React.useState(false)

  const { setDrafts, storageLoading } = useSetDraft()

  const task = React.useRef(store.task)
  const params = React.useRef(store.params)

  React.useEffect(() => {
    // Prevent drafting while changing focus or range
    if (
      isEqual(store.task, task.current) &&
      isEqual(store.params, params.current)
    ) {
      return
    }

    setDebounceLoading(true)

    const timer = setTimeout(() => {
      //@ts-ignore
      setDrafts((drafts: any) => {
        const _drafts = [...drafts]
        const found = _drafts.find((d) => d.id === store.id)

        if (found) {
          found.task = store.task
          found.params = store.params
        } else {
          _drafts.push({ id: store.id, task: store.task, params: store.params })
        }
        return _drafts
      })

      task.current = store.task
      params.current = store.params
      setDebounceLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [store, delay])

  return { isLoading: storageLoading || debounceLoading }
}
