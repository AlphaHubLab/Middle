import { DateTime } from "luxon"
import { useSetting } from "providers/setting-context"
import { useRef, useState } from "react"
import { PiHashStraight, PiRepeat, PiTimer, PiTrash } from "react-icons/pi"

import { IdentityPreview } from "~components/renderables/identity-preview"
import { TIME } from "~lib/constants"
import type { IIdentity, IRepeatParams } from "~lib/types"

interface IDateProps {
  timestamp: number
  setter: (timestamp: number) => void
}

interface IRepeatProps {
  repeatParams: IRepeatParams
  setter: (repeatParams: IRepeatParams) => void
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

/**
 * Render DueDate
 */
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
    <div className="flex items-center h-10 gap-1">
      <div className="w-4 flex justify-center">
        <PiTimer />
      </div>
      <div className="flex gap-1 sm:flex-row w-full">
        <form
          name="date-time"
          ref={form}
          onChange={handleOnChange}
          className="flex gap-1 items-center">
          <input
            name="date"
            type="date"
            className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"
            value={getDate(zone, timestamp).date}
            onChange={() => void 0}
          />
          <input
            name="time"
            value={getDate(zone, timestamp).time}
            type="time"
            className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"
            onChange={() => void 0}
          />
          <select
            className="text-xs outline-none border rounded-md h-6"
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
        <div
          role="toolbar"
          aria-orientation="horizontal"
          className="hidden sm:flex flex-auto text-xs items-center justify-start">
          <button
            aria-label="add a day to the due date"
            className="border-l border-y hover:bg-zinc-100 rounded-l-md px-1 py-[3px]"
            onClick={() => setter(timestamp + TIME.ONE_DAY)}>
            +24H
          </button>
          <button
            aria-label="add a week to the due date"
            className="border-y border-l hover:bg-zinc-100 px-1 py-[3px]"
            onClick={() => setter(timestamp + 7 * TIME.ONE_DAY)}>
            +7D
          </button>
          <button
            aria-label="Set due date to now"
            className="border hover:bg-zinc-100 rounded-r-md px-1 py-[3px]"
            onClick={() => setter((new Date().getTime() / 10_000) * 10_000)}>
            Now
          </button>
        </div>
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

/**
 * Render Tags
 */
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

/**
 * Render Identities
 */
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
      {identities.map((identity) => (
        <div
          key={`added-identity-${identity.id}`}
          className="flex items-center">
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

/**
 * Render Repeater
 */
export const RepeatWithProps = ({ repeatParams, setter }: IRepeatProps) => {
  return (
    <div className="flex items-center min-h-10 gap-2 text-xs py-2 sm:py-0">
      <div className="w-4 min-h-10 h-full flex justify-center items-center">
        <PiRepeat />
      </div>

      <div className="w-full gap-2 flex flex-wrap items-center">
        <div className="flex items-center gap-2">
          <p className="shrink-0">Repeat this</p>
          <select
            className="text-sm outline-none border rounded-md h-6"
            value={repeatParams.type}
            onChange={(e) =>
              setter({
                ...repeatParams,
                type: e.target.value as "until" | "from"
              })
            }>
            <option value="until">Until due date</option>
            <option value="from">From due date</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {repeatParams.type === "from" && (
            <>
              <span>Every</span>
              <select
                className="text-sm outline-none border rounded-md py-[1px]"
                value={repeatParams.step.toString()}
                onChange={(e) =>
                  setter({ ...repeatParams, step: Number(e.target.value) })
                }>
                <option value={(TIME.HOUR * 12).toString()}>12 Hrs</option>
                <option value={TIME.ONE_DAY.toString()}>Day</option>
                <option value={(TIME.ONE_DAY * 2).toString()}>2 Days</option>
                <option value={(TIME.ONE_DAY * 3).toString()}>3 Days</option>
                <option value={(TIME.ONE_DAY * 7).toString()}>Week</option>
                <option value={(TIME.ONE_DAY * 14).toString()}>2 Weeks</option>
                <option value={(TIME.ONE_DAY * 30).toString()}>Month</option>
              </select>
            </>
          )}
          <span>For</span>
          <>
            <input
              type="number"
              step={1}
              min={1}
              max={30}
              value={repeatParams.goal.toString()}
              onChange={(e) =>
                setter({ ...repeatParams, goal: Number(e.target.value) })
              }
              className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1 w-12"
            />
            <span>Times</span>
          </>
        </div>
      </div>
      <button
        aria-label="Remove"
        className="text-rose-500 hover:text-rose-300 text-sm pl-1"
        onClick={() => setter(null)}>
        <PiTrash />
      </button>
    </div>
  )
}
