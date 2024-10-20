import React, { useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { isTaskEmpty } from "~lib/task-helpers"
import type { Store } from "~lib/types"

export default function useDebounceStore(store: Store, delay: number = 500) {
  const [tasks, setTasks, { isLoading: storageLoading }] = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local"
      })
    },
    (v: Array<any>) => (!v ? [] : v)
  )

  const [debounceLoading, setDebounceLoading] = React.useState(false)

  useEffect(() => {
    if (isTaskEmpty(store)) return

    setDebounceLoading(true)

    const timer = setTimeout(() => {
      setDebounceLoading(false)

      const _tasks = [...tasks]
      const found = _tasks.find((t) => t.id === store.id)

      if (found) {
        found.task = store.task
        found.params = store.params
      } else {
        _tasks.push({ id: store.id, task: store.task, params: store.params })
      }

      setTasks([..._tasks])
    }, delay)

    return () => clearTimeout(timer)
  }, [store, delay])

  return { tasks, isLoading: storageLoading || debounceLoading }
}
