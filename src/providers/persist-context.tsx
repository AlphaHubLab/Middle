import { v4 as uuidv4 } from "uuid"
import { createContext, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { INode, IRecurrence, IStore, ITask } from "~lib/types"
import { mockTask } from "~mock/mock-tasks"

import { useApp, type IRecurrenceEditData } from "./app-context"
import { useRecurrence } from "./recurrence-context"

interface IPersistContext {
  tasks: ITask[]
  history: ITask[]
  storageLoading: boolean
  historyLoading: boolean
  handlePersist: (store: IStore) => Promise<void>
  handlePersistByRecurrence: (store: IStore) => Promise<void>
  handleDone: (id: string) => void
  handleUndone: (id: string) => void
  setTasks: (arg: ITask[] | ((prev: ITask[]) => void)) => Promise<void>
  setHistory: (arg: ITask[] | ((prev: ITask[]) => void)) => Promise<void>
}

const Persist = createContext<IPersistContext>(undefined)

/**
 * Delete empty nodes from the end of the tasks for
 * for better user experience on view mode.
 */
const getCleanNodes = (nodes: INode[]) => {
  const _nodes = [...nodes]

  for (let i = _nodes.length - 1; i >= 0; i--) {
    if (_nodes[i].value.trim().length > 0) break
    if (_nodes[i].type === "h") break

    _nodes.pop()
  }

  return _nodes
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

const persistNonRecurrentTask = (store: IStore, tasks: ITask[]) => {
  const _tasks = [...tasks]
  const found = _tasks.find((t) => t.id === store.id)

  const nodes = getCleanNodes(store.nodes)

  // Convert IStoreParams to ITaskParams
  const { dueDate, tags, identities } = store.params
  const params = { dueDate, tags, identities }

  // If existed
  if (found) {
    found.nodes = nodes
    found.params = params
  }
  // if new
  if (!found) {
    const dateAdded = new Date().getTime()

    _tasks.push({
      id: store.id,
      nodes,
      params,
      recurrenceId: "",
      done: false,
      dateAdded,
      dateDone: -1
    })
  }

  return { newTasks: _tasks, newRecurrence: null }
}

const persistRecurrentTask = (store: IStore, tasks: ITask[]) => {
  const _tasks = [...tasks]

  const nodes = getCleanNodes(store.nodes)

  const dateAdded = new Date().getTime()

  const dueDates = generateDates(store, dateAdded)

  // Tasks can be without any identities, so we need to make sure
  // the loop works with 0 identities
  const identitiesLen =
    store.params.identities.length > 0 ? store.params.identities.length : 1

  for (let i = 0; i < dueDates.length; i++) {
    for (let j = 0; j < identitiesLen; j++) {
      const identities =
        store.params.identities.length > 0 ? [store.params.identities[j]] : []

      const params = {
        dueDate: dueDates[i],
        tags: store.params.tags,
        identities
      }

      _tasks.push({
        id: uuidv4(),
        nodes: [{ type: "h", value: "" }],
        params,
        recurrenceId: store.id,
        done: false,
        dateDone: -1,
        dateAdded
      })
    }
  }

  const recurrence = {
    id: store.id,
    nodes: nodes,
    params: store.params
  }

  return { newTasks: _tasks, newRecurrence: recurrence }
}

const persistDispatcher = (store: IStore, tasks: ITask[]) => {
  const repeatByDate = store.params.repeatParams
    ? store.params.repeatParams.goal
    : 0

  if (repeatByDate === 0 && store.params.identities.length < 2) {
    return persistNonRecurrentTask(store, tasks)
  } else {
    return persistRecurrentTask(store, tasks)
  }
}

const persistEditRecurrenceDispatcher = (
  store: IStore,
  tasks: ITask[],
  recurrences: IRecurrence[],
  recurrenceEditData: IRecurrenceEditData
) => {
  const { newTasks: _newTasks, newRecurrence: _newRecurrence } =
    persistDispatcher(store, tasks)

  const { id, taskId, type, date, identityId } = recurrenceEditData

  let newTasks = []
  let newRecurrences = []

  if (type === "identity") {
    newTasks = _newTasks.filter(
      (task) =>
        !(
          task.recurrenceId === id &&
          task.params.identities.length > 0 &&
          task.params.identities[0].id === identityId
        )
    )

    const _recurrences = [...recurrences]
    const found = _recurrences.find((r) => r.id === id)

    found.params.identities = found.params.identities.filter(
      (identity) => identity.id !== identityId
    )

    newRecurrences = [..._recurrences]

    if (_newRecurrence) {
      newRecurrences.push(_newRecurrence)
    }
  }

  if (type === "date") {
    newTasks = _newTasks.filter(
      (task) => !(task.recurrenceId === id && task.params.dueDate === date)
    )

    newRecurrences = [...recurrences]

    if (_newRecurrence) {
      newRecurrences.push(_newRecurrence)
    }
  }

  if (type === "single") {
    newTasks = _newTasks.filter((task) => task.id !== taskId)

    newRecurrences = [...recurrences]

    if (_newRecurrence) {
      newRecurrences.push(_newRecurrence)
    }
  }

  if (type === "all") {
    newTasks = _newTasks.filter((task) => task.recurrenceId !== id)

    newRecurrences = [...recurrences]

    if (_newRecurrence) {
      newRecurrences.push(_newRecurrence)
    }
  }

  return { newTasks, newRecurrences }
}

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

  const { recurrences, setRecurrences } = useRecurrence()
  const { recurrenceEditData } = useApp()

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

  const handlePersistByRecurrence = async (store: IStore) => {
    const { newTasks, newRecurrences } = persistEditRecurrenceDispatcher(
      store,
      tasks,
      recurrences,
      recurrenceEditData
    )

    await setTasks(newTasks)
    await setRecurrences(newRecurrences)
  }

  const handlePersist = async (store: IStore) => {
    const { newTasks, newRecurrence } = persistDispatcher(store, tasks)

    if (newRecurrence) {
      await setRecurrences((prev) => [...prev, newRecurrence])
    }

    await setTasks(newTasks)
  }

  const context = {
    tasks,
    history,
    historyLoading,
    storageLoading,
    handleDone,
    handleUndone,
    handlePersist,
    handlePersistByRecurrence,
    setTasks,
    setHistory
  }

  return <Persist.Provider value={context}>{children}</Persist.Provider>
}

export const usePersist = () => useContext(Persist)
