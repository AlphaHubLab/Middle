import { IoTimeOutline } from "react-icons/io5"
import { PiLinkThin } from "react-icons/pi"

import Loading from "~components/ui/loading/loading"
import { getLabels } from "~lib/task-helpers"

export default function Status({ store, isLoading, hasLoading = true }) {
  const labels = getLabels(store)
  return (
    <div className="flex gap-2 items-center">
      {labels.map((l, i) => (
        <span
          role="Icon"
          className="min-w-4 flex justify-center text-zinc-400"
          key={`label-${i}`}>
          {l === "date" && <IoTimeOutline />}
          {l === "link" && <PiLinkThin />}
          {l === "tag" && "#"}
        </span>
      ))}
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
