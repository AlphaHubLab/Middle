import { getLabels } from "~lib/task-helpers"

export default function Status({ store, isLoading }) {
  const labels = getLabels(store)
  return (
    <div className="flex gap-2 items-center">
      {labels.map((l, i) => (
        <span className="min-w-4 flex justify-center border rounded-lg text-zinc-400" key={`label-${i}`}>
          {l}
        </span>
      ))}
      <p>{isLoading ? "..." : "OK"}</p>
    </div>
  )
}
