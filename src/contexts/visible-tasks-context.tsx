import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

import { TIME } from "~lib/constants"
import type { ITask } from "~lib/types"

import { usePersist } from "./persist-context"

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
    next48,
    unschaduled,
    other
  }
}

const VisibleTasksContext = createContext({} as IVisibleTasks)

export default function VisibleTasksProvider({
  children
}: {
  children: ReactNode
}) {
  const { tasks } = usePersist()

  const [visibleTasks, setVisibleTasks] =
    useState<IVisibleTasks>(emptyVisibleTasks)

  useEffect(() => {
    if (tasks.length === 0) return

    setVisibleTasks(filterTasks(tasks))

    const interval = setInterval(
      () => setVisibleTasks(filterTasks(tasks)),
      60 * 1000
    )

    return () => interval && clearInterval(interval)
  }, [tasks])

  return (
    <VisibleTasksContext.Provider value={visibleTasks}>
      {children}
    </VisibleTasksContext.Provider>
  )
}

export const useVisibleTasks = () => useContext(VisibleTasksContext)
