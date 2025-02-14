import { PiHash, PiLink, PiTimer } from "react-icons/pi"

import Loading from "~components/ui/loading"
import { TIME } from "~lib/constants"
import { getLabels } from "~lib/task-helpers"
import type { IStore, ITask, ITaskCore } from "~lib/types"

const remainingTime = (task: ITask) => {
  const { dueDate } = task.params

  if (dueDate === -1) return null

  const current = new Date().getTime()
  const remain = dueDate - current

  const remainValue = Math.abs(remain)
  if (remainValue < TIME.HOUR) {
    return { value: Math.round(remain / TIME.MINUTE), appendix: "Min" }
  } else if (remainValue < TIME.ONE_DAY) {
    return { value: Math.round(remain / TIME.HOUR), appendix: "Hr" }
  } else {
    return { value: Math.round(remain / TIME.ONE_DAY), appendix: "Day" }
  }
}

const ellapsedTime = (history: ITask) => {
  const { dateDone } = history

  const current = new Date().getTime()
  const ellapsed = current - dateDone

  if (ellapsed < TIME.HOUR) {
    return { value: Math.round(ellapsed / TIME.MINUTE), appendix: "Min" }
  } else if (ellapsed < TIME.ONE_DAY) {
    return { value: Math.round(ellapsed / TIME.HOUR), appendix: "Hr" }
  } else {
    return { value: Math.round(ellapsed / TIME.ONE_DAY), appendix: "Day" }
  }
}

export const LabelStatus = ({
  taskCore,
  isEditor = false
}: {
  taskCore: ITaskCore | IStore
  isEditor?: boolean
}) => {
  const { date, link, tag } = getLabels(taskCore)

  if (!date && !link && !tag) return false

  if (isEditor) {
    return (
      <div className="flex gap-2 items-center">
        {date && (
          <span className="text-zinc-400 min-w-4">
            <PiTimer />
          </span>
        )}
        {link && (
          <span className="text-zinc-400 min-w-4">
            <PiLink />
          </span>
        )}
        {tag && (
          <span className="text-zinc-400 min-w-4">
            <PiHash />
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-zinc-400 min-w-4">{date && <PiTimer />}</span>
      <span className="text-zinc-400 min-w-4">{link && <PiLink />}</span>
      <span className="text-zinc-400 min-w-4">{tag && <PiHash />}</span>
    </div>
  )
}

export const TimeStatus = ({
  item,
  itemType
}: {
  item: ITask
  itemType: "task" | "history"
}) => {
  if (itemType === "task") {
    const time = remainingTime(item)

    if (!time) return false

    return (
      <span
        className={`text-xs 
            ${time.value < 0 && "text-rose-500"}
            ${time.value >= 0 && time.appendix === "Min" && "text-orange-500"}
            ${time.value > 0 && time.appendix === "Hr" && "text-emerald-500"}        
            ${time.value > 0 && time.appendix === "Day" && "text-emerald-500"}     
            
`}>
        In {time.value + " " + time.appendix}
        {Math.abs(time.value) === 1 ? "" : "s"}
      </span>
    )
  }

  if (itemType === "history") {
    const time = ellapsedTime(item)

    return (
      <span className="text-xs text-emerald-500">
        {time.value + " " + time.appendix}
        {time.value === 1 ? "" : "s"} Ago
      </span>
    )
  }
}

export const DraftStatus = ({
  isLoading,
  isTaskEmpty
}: {
  isLoading: boolean
  isTaskEmpty: boolean
}) => {
  return (
    <div className="flex items-center">
      <div className="text-xs w-24 rounded-md flex py-[2px] justify-center gap-2 items-center bg-zinc-100 text-zinc-400">
        {isTaskEmpty ? (
          <>Empty</>
        ) : (
          <>
            {isLoading ? (
              <>
                Drafting
                <Loading r={10} color="#aaaaaa" />
              </>
            ) : (
              "Drafted"
            )}
          </>
        )}
      </div>
    </div>
  )
}
