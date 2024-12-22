import { IoTimeOutline } from "react-icons/io5"
import { PiLinkThin } from "react-icons/pi"

import Loading from "~components/ui/loading/loading"
import { getLabels } from "~lib/task-helpers"
import type { ITaskCore } from "~lib/types"

const MINUTE = 60 * 1000
const HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000

const remainingTime = (taskCore: ITaskCore) => {
  const { dueDate } = taskCore.params

  if (dueDate === -1) return null

  const current = new Date().getTime()
  const remain = dueDate - current

  if (remain > ONE_DAY) return null

  if (Math.abs(remain) < HOUR) {
    return { value: Math.floor(remain / MINUTE), appendix: "min" }
  } else {
    return { value: Math.ceil(remain / HOUR), appendix: "hr" }
  }
}

export default function Status({
  taskCore,
  isLoading,
  hasLoading = true,
  isEditor = false
}: {
  taskCore: ITaskCore
  isLoading: boolean
  hasLoading?: boolean
  isEditor?: boolean
}) {
  const { date, link, tag } = getLabels(taskCore)

  const remaining = remainingTime(taskCore)

  return (
    <div className="flex gap-2 items-center">
      {!isEditor && remaining && (
        <span
          className={`text-xs 
                      ${remaining.value < 0 && "text-rose-500"}
                      ${remaining.value >= 0 && remaining.appendix === "min" && "text-orange-500"}
                      ${remaining.value > 0 && remaining.appendix === "hr" && "text-zinc-400"}        
      `}>
          {remaining.value + remaining.appendix}{" "}
        </span>
      )}
      <span className="text-zinc-400 min-w-4">{date && <IoTimeOutline />}</span>
      <span className="text-zinc-400 min-w-4">{link && <PiLinkThin />}</span>
      <span className="text-zinc-400 min-w-4">{tag && "#"}</span>

      {hasLoading && (
        <div className="w-24 text-xs rounded-md bg-zinc-100 text-zinc-400">
          <div className="flex justify-center gap-2 items-center">
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
      )}
    </div>
  )
}
