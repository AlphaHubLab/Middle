import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FiCopy } from "react-icons/fi"

import { useSetting } from "~contexts/setting-context"
import type { INode, ITaskCore } from "~lib/types"

export const RenderAllElementsReadOnlyWithCopy = ({
  taskCore
}: {
  taskCore: ITaskCore
}) => {
  return (
    <div className="w-full">
      <p className="h-4 text-xs text-zinc-400 px-2">
        {taskCore.params.dueDate !== -1 ? (
          <DateReadOnly timestamp={taskCore.params.dueDate} />
        ) : (
          "No Dute date"
        )}
      </p>

      {taskCore.nodes.map((n, i) => (
        <RenderElementReadOnlyWithCopy key={`node-readonly-${i}`} {...n} />
      ))}
    </div>
  )
}

export const RenderElementReadOnly = ({ type, value }: INode) => {
  switch (type) {
    case "h":
      return <HeaderReadOnly value={value} />

    case "p":
      return <ParagraphReadOnly value={value} />

    case "a":
      return <LinkReadOnly value={value} />
  }
}

const HeaderReadOnly = ({ value }: { value: string }) => {
  // Don't render an empty title in readonly mode
  if (value.length === 0) return false

  return (
    <h1 className="w-full px-2 py-4 flex items-center font-bold leading-tight rounded-md">
      {value}
    </h1>
  )
}

const LinkReadOnly = ({ value }: { value: string }) => (
  <div className="py-[2px] px-2 min-h-[20px]">
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm w-full underline text-blue-500 hover:text-blue-300 leading-tight rounded-md break-all"
      href={value as string}>
      {value}
    </a>
  </div>
)

const ParagraphReadOnly = ({ value }: { value: string }) => {
  return (
    <p className="min-h-[20px] py-[2px] text-zinc-500 text-sm w-full px-2 overflow-y-hidden leading-tight rounded-md">
      {value}
    </p>
  )
}

export const RenderElementReadOnlyWithCopy = (props: INode) => {
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    if (!copy) return
    const timer = setTimeout(() => setCopy(false), 500)
    return () => clearTimeout(timer)
  }, [copy])

  return (
    <div className="flex group hover:bg-zinc-200/30 items-center rounded-md">
      <div className="flex-auto">
        <RenderElementReadOnly {...props} />
      </div>
      <div
        className={`text-sm ${copy ? "opacity-0 transition-all duration-700" : "opacity-1"} invisible group-hover:visible text-zinc-500 hover:text-zinc-400 hover:cursor-pointer px-2`}>
        <CopyToClipboard text={props.value} onCopy={() => setCopy(true)}>
          {!copy ? <FiCopy /> : <p className="text-xs">Copied</p>}
        </CopyToClipboard>
      </div>
    </div>
  )
}

const DateReadOnly = ({ timestamp }: { timestamp: number }) => {
  const { setting } = useSetting()

  if (!timestamp) return false

  const dt = DateTime.fromMillis(timestamp).setZone(setting.preferredTimeZone)
  const date = dt.toFormat("LLL dd, yyyy")
  const time = dt.toFormat("T")

  return (
    <span>
      {date} | {time}
    </span>
  )
}
