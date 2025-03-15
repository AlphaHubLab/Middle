import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

import { visibleTasksRefetchInterval } from "~fetch.config"
import { TIME } from "~lib/constants"
import type { ITask } from "~lib/types"

import { usePersist } from "./persist-provider"

interface IVisibleTasksContext {
  visibleTasks: IVisibleTasks
  storageLoading: boolean
}

interface IVisibleTasks {
  overdue: ITask[]
  urgent: ITask[]
  next24: ITask[]
  next48: ITask[]
  unschaduled: ITask[]
  other: ITask[]
}

const emptyVisibleTasks = {
  overdue: [],
  urgent: [],
  next24: [],
  next48: [],
  unschaduled: [],
  other: []
}

export const filterTasks = (tasks: ITask[]): IVisibleTasks => {
  const current = new Date().getTime()

  const unschaduled: ITask[] = []
  const urgent: ITask[] = []
  const next24: ITask[] = []
  const next48: ITask[] = []
  const overdue: ITask[] = []
  const other: ITask[] = []

  for (let task of tasks) {
    const { dueDate } = task.params

    if (dueDate === -1) {
      unschaduled.push(task)
    } else if (dueDate < current) {
      overdue.push(task)
    } else if (dueDate - TIME.HOUR < current) {
      urgent.push(task)
    } else if (dueDate - TIME.ONE_DAY < current) {
      next24.push(task)
    } else if (dueDate - TIME.TWO_DAYS < current) {
      next48.push(task)
    } else {
      other.push(task)
    }
  }

  return {
    overdue: overdue.sort((a, b) => a.params.dueDate - b.params.dueDate),
    urgent: urgent.sort((a, b) => a.params.dueDate - b.params.dueDate),
    next24: next24.sort((a, b) => a.params.dueDate - b.params.dueDate),
    next48: next48.sort((a, b) => a.params.dueDate - b.params.dueDate),
    unschaduled: unschaduled.sort((a, b) => b.dateAdded - a.dateAdded),
    other
  }
}

const VisibleTasksContext = createContext<IVisibleTasksContext>(null)

export default function VisibleTasksProvider({
  children
}: {
  children: ReactNode
}) {
  const { tasks, storageLoading } = usePersist()

  const [visibleTasks, setVisibleTasks] = useState<IVisibleTasks | null>(null)

  useEffect(() => {
    // console.log(tasks.length)
    if (tasks.length === 0) {
      setVisibleTasks(emptyVisibleTasks)
      return
    }

    setVisibleTasks(filterTasks(tasks))

    const interval = setInterval(
      () => setVisibleTasks(filterTasks(tasks)),
      visibleTasksRefetchInterval
    )

    return () => interval && clearInterval(interval)
  }, [tasks])

  const context = {
    visibleTasks,
    storageLoading: storageLoading || !visibleTasks
  }

  return (
    <VisibleTasksContext.Provider value={context}>
      {children}
    </VisibleTasksContext.Provider>
  )
}

export const useVisibleTasks = () => useContext(VisibleTasksContext)
