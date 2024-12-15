import moment from "moment"
import { useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FiCopy } from "react-icons/fi"

import type { ITaskCore, NodeType } from "~lib/types"

interface IRenderElementReadOnlyProps {
  value: string
  type: NodeType
}

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
        <div key={`node-readonly-${i}`}>
          <RenderElementReadOnlyWithCopy {...n} />
        </div>
      ))}
    </div>
  )
}
export const RenderElementReadOnly = ({
  type,
  value
}: IRenderElementReadOnlyProps) => {
  if (type === "h") {
    return <HeaderReadOnly value={value} />
  }
  if (type === "p") {
    return <ParagraphReadOnly value={value} />
  }
  if (type === "a") {
    return <LinkReadOnly value={value} />
  }
}

const HeaderReadOnly = ({ value }: { value: string }) => {
  return (
    <h1 className="w-full h-[36px] p-2 flex items-center font-bold leading-tight rounded-md">
      {value}
    </h1>
  )
}

const LinkReadOnly = ({ value }: { value: string }) => (
  <div className="py-[2px] px-2 h-[20px]">
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm w-full underline text-blue-500 hover:text-blue-300 leading-tight rounded-md"
      href={value as string}>
      {value}
    </a>
  </div>
)

const ParagraphReadOnly = ({ value }: { value: string }) => {
  return (
    <p className="h-[20px] py-[2px] text-zinc-500 text-sm w-full px-2 overflow-y-hidden leading-tight rounded-md">
      {value}
    </p>
  )
}

export const RenderElementReadOnlyWithCopy = (
  props: IRenderElementReadOnlyProps
) => {
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    if (!copy) return
    const timer = setTimeout(() => setCopy(false), 500)
    return () => clearTimeout(timer)
  }, [copy])

  return (
    <div className="flex group hover:bg-zinc-200/50 items-center rounded-md">
      <div className="flex-auto">
        <RenderElementReadOnly {...props} />
      </div>
      <div
        className={`text-sm  ${copy ? "opacity-0 transition-all duration-700" : "opacity-1"} invisible group-hover:visible text-zinc-500 hover:text-zinc-400 hover:cursor-pointer px-2`}>
        <CopyToClipboard text={props.value} onCopy={() => setCopy(true)}>
          {!copy ? <FiCopy /> : <p className="text-xs">Copied</p>}
        </CopyToClipboard>
      </div>
    </div>
  )
}

const DateReadOnly = ({ timestamp }: { timestamp: number }) => {
  const m = moment(timestamp)
  const time = m.format("LT")
  const date = m.format("ll")

  return (
    <p>
      {date} {time}
    </p>
  )
}
