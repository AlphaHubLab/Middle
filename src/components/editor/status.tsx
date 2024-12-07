import { IoTimeOutline } from "react-icons/io5"
import { PiLinkThin } from "react-icons/pi"

import Loading from "~components/ui/loading/loading"
import { getLabels } from "~lib/task-helpers"

export default function Status({
  store,
  isLoading,
  hasLoading = true,
  isEditor = false
}) {
  const labels = getLabels(store)

  const untilDue = (store) => {
    const { dueDate } = store.params
    const current = new Date().getTime()
    const remain = dueDate - current
    if (remain < 60 * 60 * 1000) return Math.floor(remain / (60 * 1000)) + "m"
    if (remain < 24 * 60 * 60 * 1000)
      return Math.ceil(remain / (60 * 60 * 1000)) + "h"
  }

  return (
    <div className="flex gap-2 items-center">
      {!isEditor &&
        store.params.dueDate !== -1 &&
        store.params.dueDate < new Date().getTime() + 24 * 60 * 60 * 1000 && (
          <span className="text-xs text-zinc-400">{untilDue(store)}</span>
        )}
      <span className="text-zinc-400 min-w-4">
        {labels.date && <IoTimeOutline />}
      </span>
      <span className="text-zinc-400 min-w-4">
        {labels.link && <PiLinkThin />}
      </span>
      <span className="text-zinc-400 min-w-4">
        {labels.tag && "#"}
      </span>
      {/* {labels.map((l, i) => (
        <span
          role="Icon"
          className="min-w-4 flex justify-center text-zinc-400"
          key={`label-${i}`}>
          {l === "date" && <IoTimeOutline />}
          {l === "link" && <PiLinkThin />}
          {l === "tag" && "#"}
        </span>
      ))} */}
      {hasLoading && (
        <div className="w-24 text-xs rounded-md bg-zinc-100 text-zinc-400">
          {isLoading ? (
            <div className="flex justify-center gap-2 items-center">
              Drafting
              <Loading r={10} color="#aaaaaa" />
            </div>
          ) : (
            <div className="flex justify-center gap-2 items-center">
              Drafted
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function TaskStatus({}) {}
