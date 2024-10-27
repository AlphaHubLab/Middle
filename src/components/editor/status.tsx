import Loading from "~components/loading/loading"
import { getLabels } from "~lib/task-helpers"

export default function Status({ store, isLoading }) {
  const labels = getLabels(store)
  return (
    <div className="flex gap-2 items-center">
      {labels.map((l, i) => (
        <span
          className="min-w-4 flex justify-center border rounded-lg text-zinc-400"
          key={`label-${i}`}>
          {l}
        </span>
      ))}
      <div className="w-24 rounded-md bg-zinc-100 text-zinc-400">
        {isLoading ? (
          <div className="flex justify-center gap-2 items-center">
            Drafting
            <Loading r={10} color="#aaaaaa" />
          </div>
        ) : (
          <div className="flex justify-center gap-2 items-center">Drafted</div>
        )}
      </div>
    </div>
  )
}
