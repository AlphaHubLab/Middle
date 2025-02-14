import { Children, type ReactElement, type ReactNode } from "react"

import NothingToFind from "../../ui/svgs/nothing-to-fetch.png"

const isListEmpty = (children: ReactElement[]) => {
  if (children.length === 0) return true

  for (let i = 0; i < children.length; i++) {
    if (children[i].props.children.length) return false
  }

  return true
}

export const TaskGroupWrapper = ({
  children,
  messageType = "other"
}: {
  children: ReactNode
  messageType?: "other" | "search"
}) => {
  const messages = [
    "To do or not to do - That is the question!",
    "Nothing to fetch...",
    "Seems... Good?"
  ]

  const ch = Children.toArray(children) as ReactElement[]

  if (isListEmpty(ch)) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-sm text-zinc-400">
        {messageType === "other"
          ? messages[Math.floor(Math.random() * messages.length)]
          : "Found Nothing!"}

        <img
          src={NothingToFind}
          alt="nothing"
          width={200}
        />
      </div>
    )
  }

  return (
    <div className="transition-all duration-200 pb-32 bg-inherit">{ch}</div>
  )
}

/**
 *
 */
export const TaskGroup = (props: {
  children: ReactNode[]
  label: string
  value: string
  variant: "neutral" | "orange" | "red"
  bg?: boolean
}) => {
  if (props.children.length === 0) return false

  return (
    <div
      className="pb-8 bg-inherit"
      id={props.value}
      data-fetch-task-group={props.value}>
      <h1
        className={`text-sm sticky py-1 top-0 z-10 border-b border-black/15 bg-inherit ${props.variant === "red" && "text-rose-500"} ${props.variant === "orange" && "text-orange-500"} ${props.variant === "neutral" && "text-zinc-400"}`}>
        {props.label}
      </h1>
      <div className="transition-all duration-200 py-2">{props.children}</div>
    </div>
  )
}
