import React from "react"
import isEqual from "react-fast-compare"

import { isTaskEmpty } from "~lib/task-helpers"
import type { IStore } from "~lib/types"
import { useDraft } from "~providers/draft-context"

export default function useDebouncedDraft(
  store: IStore,
  enabled: boolean = true,
  delay: number = 1000
) {
  const [debounceLoading, setDebounceLoading] = React.useState(false)

  const { drafts, setDrafts, storageLoading } = useDraft()

  const nodes = React.useRef(store.nodes)
  const params = React.useRef(store.params)

  React.useEffect(() => {
    if (!enabled) return

    // Prevent creating empty draft with whitespaces on a new task
    if (isTaskEmpty(store, "loose")) return

    // Prevent drafting while changing store.focusedNodes or store.range
    if (
      isEqual(store.nodes, nodes.current) &&
      isEqual(store.params, params.current)
    ) {
      return
    }

    setDebounceLoading(true)

    const timer = setTimeout(() => {
      const _drafts = [...drafts]
      const found = _drafts.find((d) => d.id === store.id)
      const dateDrafted = new Date().getTime()

      if (found) {
        found.nodes = store.nodes
        found.params = store.params
        found.dateDrafted = dateDrafted
      } else {
        _drafts.push({
          recurrenceId: "",
          id: store.id,
          nodes: store.nodes,
          params: store.params,
          dateDrafted
        })
      }

      nodes.current = store.nodes
      params.current = store.params

      setDebounceLoading(false)
      setDrafts(_drafts)
    }, delay)

    return () => {
      clearTimeout(timer)
      setDebounceLoading(false)
    }
  }, [store, delay])

  return { isLoading: storageLoading || debounceLoading }
}
