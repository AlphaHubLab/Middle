import type { ReactNode } from "react"
import { IoTimeOutline } from "react-icons/io5"
import { PiLinkThin } from "react-icons/pi"

import Loading from "~components/ui/loading/loading"
import { getLabels } from "~lib/task-helpers"
import type { IHistory, ITask, ITaskCore } from "~lib/types"

const MINUTE = 60 * 1000
const HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000

const remainingTime = (task: ITask) => {
  const { dueDate } = task.params

  // Subject to remove
  if (dueDate === -1) return null

  const current = new Date().getTime()
  const remain = dueDate - current

  // Subject to remove
  // if (remain > ONE_DAY) return null

  const remainValue = Math.abs(remain)
  if (remainValue < HOUR) {
    return { value: Math.round(remain / MINUTE), appendix: "Min" }
  } else if (remainValue < ONE_DAY) {
    return { value: Math.round(remain / HOUR), appendix: "Hr" }
  } else {
    return { value: Math.round(remain / ONE_DAY), appendix: "Day" }
  }
}

const ellapsedTime = (history: IHistory) => {
  const { dateDone } = history

  // Subject to remove
  // if (dueDate === -1) return null

  const current = new Date().getTime()
  const ellapsed = current - dateDone

  // Subject to remove
  // if (remain > ONE_DAY) return null

  if (ellapsed < HOUR) {
    return { value: Math.round(ellapsed / MINUTE), appendix: "Min" }
  } else if (ellapsed < ONE_DAY) {
    return { value: Math.round(ellapsed / HOUR), appendix: "Hr" }
  } else {
    return { value: Math.round(ellapsed / ONE_DAY), appendix: "Day" }
  }
}

export const LabelStatus = ({
  taskCore,
  isEditor = false
}: {
  taskCore: ITaskCore
  isEditor?: boolean
}) => {
  const { date, link, tag } = getLabels(taskCore)

  return (
    <div className="flex gap-2 items-center">
      <span className={`text-zinc-400 ${!isEditor && "min-w-4"}`}>
        {date && <IoTimeOutline />}
      </span>
      <span className={`text-zinc-400 ${!isEditor && "min-w-4"}`}>
        {link && <PiLinkThin />}
      </span>
      <span className={`text-zinc-400 ${!isEditor && "min-w-4"}`}>
        {tag && "#"}
      </span>
    </div>
  )
}

export const TimeStatus = ({
  item,
  itemType
}: {
  item: ITask | IHistory
  itemType: "task" | "history"
}) => {
  if (itemType === "task") {
    const time = remainingTime(item as ITask)

    if (!time) return false

    return (
      <span
        className={`text-xs 
            ${time.value < 0 && "text-rose-500"}
            ${time.value >= 0 && time.appendix === "Min" && "text-orange-500"}
            ${time.value > 0 && time.appendix === "Hr" && "text-zinc-400"}        
`}>
        In {time.value + " " + time.appendix}
        {Math.abs(time.value) === 1 ? "" : "s"}
      </span>
    )
  }

  if (itemType === "history") {
    const time = ellapsedTime(item as IHistory)

    return (
      <span className="text-xs text-emerald-500">
        {time.value + " " + time.appendix}
        {time.value === 1 ? "" : "s"} Ago
      </span>
    )
  }
}

export const DraftStatus = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="flex items-center">
      <div className="text-xs w-24 rounded-md flex justify-center gap-2 items-center bg-zinc-100 text-zinc-400">
        {isLoading ? (
          <>
            Drafting
            <Loading r={10} color="#aaaaaa" />
          </>
        ) : (
          "Drafted"
        )}
      </div>
    </div>
  )
}
