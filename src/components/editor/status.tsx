import moment from "moment"
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

  const current = new Date().getTime()
  const remain = dueDate - current

  if (Math.abs(remain) < HOUR) {
    return { value: Math.floor(remain / MINUTE), appendix: "m" }
  }

  if (Math.abs(remain) < ONE_DAY) {
    return { value: Math.ceil(remain / HOUR), appendix: "h" }
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

  const NEXT_24 = new Date().getTime() + ONE_DAY

  const remaining = remainingTime(taskCore)

  return (
    <div className="flex gap-2 items-center">
      {!isEditor &&
        taskCore.params.dueDate !== -1 &&
        taskCore.params.dueDate < NEXT_24 && (
          <span
            className={`text-xs 
                      ${remaining.value < 0 && "text-rose-500"}
                      ${remaining.value >= 0 && remaining.appendix === "m" && "text-orange-500"}
                      ${remaining.value > 0 && remaining.appendix === "h" && "text-zinc-400"}        
      `}>
            {/* {remaining.value + remaining.appendix}{" "} */}
            {moment(taskCore.params.dueDate).fromNow()}
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
