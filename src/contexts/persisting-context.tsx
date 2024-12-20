import { createContext, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

// import { config } from "~fetch.config"
import type { IHistory, IStore, ITask } from "~lib/types"
import { mockTask } from "~mock/mock-tasks"

interface PersistContext {
  tasks: ITask[]
  history: IHistory[]
  handlePersist: (store: IStore) => void
  handleDone: (id: string) => void
  handleUndone: (id: string) => void
  storageLoading: boolean
  historyLoading: boolean
}

const Persisting = createContext({} as PersistContext)

export default function PersistProvider({ children, isDev = false }) {
  const [tasks, setTasks, { isLoading: storageLoading, remove: removeTasks }] =
    useStorage(
      {
        key: "middle-tasks",
        instance: new Storage({
          area: "local"
        })
      },
      (v: ITask[]) => (!v ? [] : v)
    )

  const [
    history,
    setHistory,
    { isLoading: historyLoading, remove: removeHistory }
  ] = useStorage(
    {
      key: "middle-history",
      instance: new Storage({
        area: "local"
      })
    },
    (v: IHistory[]) => (!v ? [] : v)
  )

  // uncomment the following lines to reset storage and
  // refresh the page with cmd + r ~ 7-8 times

  // useEffect(() => {
  //   if (tasks.length) {
  //     removeTasks()
  //     removeHistory()
  //   }
  // }, [tasks])

  useEffect(() => {
    if (isDev && tasks.length === 0) setTasks(mockTask)
  }, [tasks])

  const handleDone = (id: string) => {
    const _tasks = [...tasks]
    const found = _tasks.find((t) => t.id === id)

    const task: IHistory = {
      id: found.id,
      nodes: found.nodes,
      params: found.params,
      dateAdded: found.dateAdded,
      done: true,
      dateDone: new Date().getTime()
    }

    setTasks(_tasks.filter((t) => t.id !== id))
    setHistory((prev) => [...prev, task])
  }

  const handleUndone = (id: string) => {
    const _history = [...history]
    const found = _history.find((t) => t.id === id)

    const task: ITask = {
      id: found.id,
      nodes: found.nodes,
      params: found.params,
      dateAdded: found.dateAdded,
      done: false
    }

    setTasks((prev) => [...prev, task])
    setHistory(_history.filter((h) => h.id !== id))
  }

  const handlePersist = (store: IStore) => {
    const _tasks = [...tasks]
    const found = _tasks.find((t) => t.id === store.id)
    // Do not need cloning since data will be serialized in storage
    // const clone = structuredClone(store)

    if (found) {
      found.nodes = store.nodes
      found.params = store.params
    } else {
      _tasks.push({
        id: store.id,
        nodes: store.nodes,
        params: store.params,
        done: false,
        dateAdded: new Date().getTime()
      })
    }

    setTasks(_tasks)
  }

  const context = {
    tasks,
    handlePersist,
    storageLoading,
    handleDone,
    handleUndone,
    historyLoading,
    history
  }

  return <Persisting.Provider value={context}>{children}</Persisting.Provider>
}

export const usePersistContext = () => useContext(Persisting)
