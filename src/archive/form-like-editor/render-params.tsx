import moment from "moment"

export const DateWithProps = ({ value, setter }) => {
  const m = moment(value)
  const date = m.format().slice(0, -9)

  const handleOnChange = (e) => {
    const date = new Date(e.target.value).getTime()
    setter(date)
  }

  return (
    <div className="border rounded-xl p-1 mb-4">
      <div className="flex gap-2 text-xs">
        <button
          className="bg-emerald-100 rounded-full px-2 py-1"
          onClick={() => setter(value + 24 * 60 * 60 * 1000)}>
          +24H
        </button>
        <button
          className="bg-emerald-200 rounded-full px-2 py-1"
          onClick={() => setter(value + 7 * 24 * 60 * 60 * 1000)}>
          +7D
        </button>
        <button
          className="bg-emerald-300 rounded-full px-2 py-1"
          onClick={() => setter((new Date().getTime() / 10_000) * 10_000)}>
          Now
        </button>
        <button
          className="text-red-500 hover:text-red-300"
          onClick={() => setter(-1)}>
          Remove
        </button>
      </div>
      <input
        type="datetime-local"
        className="bg-zinc-50 text-sm text-zinc-500 rounded-lg p-1 my-1"
        value={date}
        onChange={handleOnChange}
      />
    </div>
  )
}

export const TagsWithProps = ({ tags }) => {
  return (
    <div className="flex gap-2">
      {tags.map((t, i) => (
        <span
          className="text-zinc-400 bg-zinc-100 rounded-full text-xs px-2 py-1"
          key={`tags_${i}`}>
          {t}
        </span>
      ))}
    </div>
  )
}
