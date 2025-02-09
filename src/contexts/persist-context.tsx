import { createContext, useContext, useEffect, useState } from "react"
import uuid4 from "uuid4"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IStore, ITask } from "~lib/types"
import { mockTask } from "~mock/mock-tasks"

import { useReference } from "./reference-context"

interface IPersistContext {
  tasks: ITask[]
  history: ITask[]
  storageLoading: boolean
  historyLoading: boolean
  handlePersist: (store: IStore) => void
  handleDone: (id: string) => void
  handleUndone: (id: string) => void
  setTasks: (arg: ITask[] | ((prev: ITask[]) => void)) => Promise<void>
  setHistory: (arg: ITask[] | ((prev: ITask[]) => void)) => Promise<void>
}

const generateDates = (store: IStore, dateAdded: number) => {
  if (!store.params.repeatParams) {
    return [store.params.dueDate]
  }

  const gd = []

  if (store.params.repeatParams.type === "until") {
    const diff =
      (store.params.dueDate - dateAdded) / store.params.repeatParams.goal

    for (let i = 0; i < store.params.repeatParams.goal; i++) {
      gd.push(store.params.dueDate - diff * i)
    }
  }

  if (store.params.repeatParams.type === "from") {
    for (let i = 0; i < store.params.repeatParams.goal; i++) {
      gd.push(store.params.dueDate + store.params.repeatParams.step * i)
    }
  }

  return gd.reverse()
}

const Persist = createContext<IPersistContext>(undefined)

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
    (v: ITask[]) => (!v ? [] : v)
  )

  const { setReferences } = useReference()

  // uncomment the following lines to reset storage and
  // refresh the page with cmd + r ~ 7-8 times

  // useEffect(() => {
  //   // if (tasks.length) {
  //   removeTasks()
  //   removeHistory()
  //   // }
  // }, [tasks])

  useEffect(() => {
    if (isDev && tasks.length === 0) setTasks(mockTask)
  }, [tasks])

  const handleDone = (id: string) => {
    const _tasks = [...tasks]
    const found = _tasks.find((t) => t.id === id)

    if (!found) return

    const task: ITask = {
      ...found,
      done: true,
      dateDone: new Date().getTime()
    }

    setTasks(_tasks.filter((t) => t.id !== id))
    setHistory((prev) => [...prev, task])
  }

  const handleUndone = (id: string) => {
    const _history = [...history]
    const found = _history.find((h) => h.id === id)

    if (!found) return

    const task: ITask = {
      ...found,
      done: false,
      dateDone: -1
    }

    setTasks((prev) => [...prev, task])
    setHistory(_history.filter((h) => h.id !== id))
  }

  const handlePersist = (store: IStore, editAsReference?: boolean) => {
    const _tasks = [...tasks]

    const found = _tasks.find((t) => t.id === store.id)

    const _nodes = [...store.nodes]

    // Delete last empty nodes for better user experience.
    for (let i = _nodes.length - 1; i >= 0; i--) {
      if (_nodes[i].value.trim().length > 0) break
      _nodes.pop()
    }

    // Save changes to an existing task
    if (found) {
      // Convert IStoreParams to ITaskParams
      const params = {
        dueDate: store.params.dueDate,
        tags: store.params.tags,
        identities: store.params.identities
      }

      found.nodes = _nodes
      found.params = params
    } else {
      const dateAdded = new Date().getTime()

      const repeatByDate = store.params.repeatParams
        ? store.params.repeatParams.goal
        : 0

      // No need to generate repeated tasks for date and identities
      if (repeatByDate === 0 && store.params.identities.length < 2) {
        // Convert store params to single task params
        const params = {
          dueDate: store.params.dueDate,
          tags: store.params.tags,
          identities: store.params.identities
        }

        _tasks.push({
          id: store.id,
          nodes: _nodes,
          params,
          reference: "",
          done: false,
          dateAdded,
          dateDone: -1
        })
      }
      // Need for generate repeated tasks
      else {
        const generatedDates = generateDates(store, dateAdded)

        generatedDates.forEach((dueDate) => {
          // No need for generate by identities
          if (store.params.identities.length < 2) {
            // Convert store params to single task params with dueDate
            const params = {
              dueDate,
              tags: store.params.tags,
              identities: store.params.identities
              // incrementors: store.params.incrementors
            }

            _tasks.push({
              id: uuid4(),
              nodes: [{ type: "h", value: "" }],
              params,
              reference: store.id,
              done: false,
              dateDone: -1,
              dateAdded
            })
          }
          // Generating by identities and date
          else {
            store.params.identities.forEach((identity) => {
              // Convert store params to single task params with dueDate and identity
              const params = {
                dueDate,
                tags: store.params.tags,
                identities: [identity]
                // incrementors: store.params.incrementors
              }

              _tasks.push({
                id: uuid4(),
                nodes: [{ type: "h", value: "" }],
                params,
                reference: store.id,
                done: false,
                dateDone: -1,
                dateAdded
              })
            })
          }
        })

        const reference = {
          id: store.id,
          nodes: store.nodes,
          params: store.params
        }

        setReferences((prev) => [...prev, reference])
      }
    }

    setTasks(_tasks)
  }

  const context = {
    tasks,
    history,
    historyLoading,
    storageLoading,
    handleDone,
    handleUndone,
    handlePersist,
    setTasks,
    setHistory
  }

  return <Persist.Provider value={context}>{children}</Persist.Provider>
}

export const usePersist = () => useContext(Persist)
