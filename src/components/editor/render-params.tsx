import moment from "moment"
import { IoTimeOutline } from "react-icons/io5"

export const DateWithProps = ({ value, setter }) => {
  const m = moment(value)
  const date = m.format().slice(0, -9)

  const handleOnChange = (e) => {
    const date = new Date(e.target.value).getTime()
    setter(date)
  }

  return (
    <div className="flex items-center h-10 gap-2">
      <div className="w-4 flex justify-center">
        <IoTimeOutline />
      </div>
      <input
        type="datetime-local"
        className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"
        value={date}
        onChange={handleOnChange}
      />
      <div className="flex gap-2 text-xs items-center justify-center">
        <button
          className="hover:bg-zinc-100 border rounded-md px-2 py-1"
          onClick={() => setter(value + 24 * 60 * 60 * 1000)}>
          +24H
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-2 py-1"
          onClick={() => setter(value + 7 * 24 * 60 * 60 * 1000)}>
          +7D
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-2 py-1"
          onClick={() => setter((new Date().getTime() / 10_000) * 10_000)}>
          Now
        </button>
        <button
          className="text-red-500 hover:text-red-300"
          onClick={() => setter(-1)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export const TagsWithProps = ({ tags }: { tags: string[] }) => {
  return (
    <div className="ml-6 min-h-10 flex pb-1 flex-wrap oveflow-hidden items-center gap-1">
      {tags.map((t, i) => (
        <span
          role="tag"
          className="before:content-[x] text-zinc-400 bg-zinc-100 rounded-md text-xs px-2 py-1"
          key={`tags_${i}`}>
          {t}
        </span>
      ))}
    </div>
  )
}
// #base #test #shit #shit #chain #1w #w1 #ed/ #_a #_ #1_ #ff #f #fff #f3f3f #f2f2f323f
