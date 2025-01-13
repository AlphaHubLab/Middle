import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { PiHashStraight, PiTimer, PiTrash } from "react-icons/pi"

import { IdentityPreview } from "~components/options/identity-setting"
import { useSetting } from "~contexts/setting-context"
import { TIME } from "~lib/constants"
import type { IIdentity } from "~lib/types"

interface IDateProps {
  timestamp: number
  setter: (timestamp: number) => void
}

interface IIdentityProps {
  identities: IIdentity[]
  removeIdentity: (id: number) => void
}

const getDate = (zone: string, timestamp: number) => {
  const date = DateTime.fromMillis(timestamp).setZone(zone)

  return {
    iso: date.toFormat("yyyy-MM-dd'T'T"),
    date: date.toFormat("yyyy-MM-dd"),
    time: date.toFormat("T")
  }
}

export const DateWithProps = ({ timestamp, setter }: IDateProps) => {
  const { setting } = useSetting()

  const [zone, setZone] = useState(setting.editorTimeZone)

  const form = useRef<HTMLFormElement>(null)

  const handleOnChange = () => {
    const formData = new FormData(form.current)
    const iso = `${formData.get("date")}T${formData.get("time")}`
    const newTimestamp = DateTime.fromISO(iso, { zone }).valueOf()

    setter(newTimestamp)
  }

  return (
    <div className="flex items-center h-10 gap-2">
      <div className="w-4 flex justify-center">
        <PiTimer />
      </div>
      <form
        name="date-time"
        ref={form}
        onChange={handleOnChange}
        className="flex gap-2">
        <input
          name="date"
          type="date"
          className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"
          value={getDate(zone, timestamp).date}
        />
        <input
          name="time"
          value={getDate(zone, timestamp).time}
          type="time"
          className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"></input>
        <select
          className="text-sm outline-none"
          value={zone}
          onChange={(e) => setZone(e.target.value)}>
          <option value="local">Local</option>
          <option value="utc">UTC/GMT</option>
          <option value="est">EST</option>
          <option value="cst">CST</option>
          <option value="mst">MST</option>
          <option value="pst">PST</option>
          <option value="utc+08">WST</option>
        </select>
      </form>
      <div className="flex flex-auto gap-1 text-xs items-center justify-start">
        <button
          className="border hover:bg-zinc-100 rounded-md px-1 py-[3px]"
          onClick={() => setter(timestamp + TIME.ONE_DAY)}>
          +24H
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-1 py-[3px]"
          onClick={() => setter(timestamp + 7 * TIME.ONE_DAY)}>
          +7D
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-1 py-[3px]"
          onClick={() => setter((new Date().getTime() / 10_000) * 10_000)}>
          Now
        </button>
      </div>
      <button
        aria-label="Remove"
        className="text-rose-500 hover:text-rose-300 text-sm pl-1"
        onClick={() => setter(-1)}>
        <PiTrash />
      </button>
    </div>
  )
}

export const TagsWithProps = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex">
      <div className="w-4 flex items-center justify-center text-zinc-500 text-xs">
        <PiHashStraight />
      </div>
      <div className="pl-2 min-h-10 flex pb-1 flex-wrap oveflow-hidden items-center gap-1">
        {tags.map((tag, i) => (
          <span
            role="status"
            className="before:content-[x] text-zinc-400 bg-zinc-100 rounded-md text-xs px-1 py-1"
            key={`tags-${i}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export const IdentityWithProps = ({
  identities,
  removeIdentity
}: IIdentityProps) => {
  return (
    <div className="py-4">
      <div className="pb-1 pl-6">
        <h3 className="text-xs border-b-[1px] text-zinc-400">
          This Task should be done using:
        </h3>
      </div>
      {identities.map((identity, i) => (
        <div key={`added-identity-${i}`} className="flex items-center">
          <div className="flex w-full">
            <IdentityPreview identity={identity} />
            <div className="flex items-start pt-1 pl-2">
              <button
                aria-label="Remove"
                onClick={() => removeIdentity(identity.id)}
                className="text-sm text-rose-500 hover:text-rose-300">
                <PiTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
