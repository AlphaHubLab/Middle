import { useMemo } from "react"

import { usePersistContext } from "~contexts/persisting-context"
import type { IHistory } from "~lib/types"

import { UpcommingItem } from "./tasklist"

// const createHistoryList = (history: IHistory[]) => {
//   const ONE_DAY = 24 * 60 * 60 * 1000
//   const TWO_DAY = 48 * 60 * 60 * 1000

//   const current = new Date().getTime()

//   const today: IHistory[] = []
//   const yesterday: IHistory[] = []
//   const next24: ITask[] = []
//   const next48: ITask[] = []
//   const overdue: ITask[] = []
//   const other: ITask[] = []

//   for (let task of history) {
//     const { dateDone } = task

//     if (current - dateDone < ONE_DAY) {
//       today.push(task)
//     } else if (current - dateDone < TWO_DAY) {
//       yesterday.push(task)
//     } else if (dueDate - ONE_HOUR < current) {
//       urgent.push(task)
//     } else if (dueDate - ONE_DAY < current) {
//       next24.push(task)
//     } else if (dueDate - TWO_DAY < current) {
//       next48.push(task)
//     } else {
//       other.push(task)
//     }
//   }

//   return {
//     overdue: overdue.sort((a, b) => a.params.dueDate - b.params.dueDate),
//     urgent: urgent.sort((a, b) => a.params.dueDate - b.params.dueDate),
//     next24: next24.sort((a, b) => a.params.dueDate - b.params.dueDate),
//     next48,
//     unschaduled,
//     other
//   }
// }

export default function HistoryList() {
  const { history } = usePersistContext()

  //   const historyList = useMemo(() => {}, [history])
  return <div></div>
}
