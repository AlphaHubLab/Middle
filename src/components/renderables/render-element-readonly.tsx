import { DateTime } from "luxon"

import { IdentityPreview } from "~components/renderables/identity-preview"
import Copiable from "~components/ui/copiable"
import { getPreviewNodes } from "~lib/task-helpers"
import type { IIdentity, INode, ITaskCore } from "~lib/types"
import { useRecurrence } from "~providers/recurrence-context"
import { useSetting } from "~providers/setting-context"

export const RenderAllElementsReadOnlyWithCopy = ({
  taskCore
}: {
  taskCore: ITaskCore
}) => {
  const { recurrences } = useRecurrence()

  const nodes = getPreviewNodes(taskCore, recurrences)

  return (
    <div className="w-full">
      {taskCore.params.dueDate !== -1 && (
        <div className="h-4 mb-4 text-xs text-zinc-400 px-2">
          <DateReadOnly timestamp={taskCore.params.dueDate} />
        </div>
      )}

      {taskCore.params.identities.length > 0 && (
        <IdentityReadonly identity={taskCore.params.identities[0]} />
      )}
      <div className="mt-2">
        {nodes.map((node, i) => (
          <RenderElementReadOnlyWithCopy key={`node-readonly-${i}`} {...node} />
        ))}
      </div>
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
  return (
    <h1 className="w-full py-1 px-2 min-h-[20px] text-sm flex h-full items-center font-medium text-black/80 leading-tight rounded-md">
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
    <p className="min-h-[20px] py-[2px] text-black/60 text-sm w-full px-2 overflow-y-hidden leading-tight rounded-md break-all">
      {value}
    </p>
  )
}

export const RenderElementReadOnlyWithCopy = (props: INode) => {
  // Don't render an empty title in readonly mode
  if (props.type === "h" && props.value.trim().length === 0) return false

  return (
    <Copiable textToCopy={props.value}>
      <RenderElementReadOnly {...props} />
    </Copiable>
  )
}

export const DateReadOnly = ({ timestamp }: { timestamp: number }) => {
  const { setting } = useSetting()

  if (!timestamp) return false

  const dt = DateTime.fromMillis(timestamp).setZone(setting.preferredTimeZone)
  const date = dt.toFormat("LLL dd, yyyy")
  const time = dt.toFormat("T")

  return (
    <p>
      {date} | {time}
    </p>
  )
}

export const IdentityReadonly = ({ identity }: { identity: IIdentity }) => {
  return (
    <div className="px-2">
      <h3 className="text-xs text-zinc-400">Do task with:</h3>
      <div className="flex items-center w-full">
        <IdentityPreview identity={identity} />
      </div>
    </div>
  )
}
