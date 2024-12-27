import { type ReactNode } from "react"

export const TaskGroupWrapper = ({ children }: { children: ReactNode[] }) => {
  const messages = [
    "To do or not to do - That is the question!",
    "Just nothing..."
  ]

  if (children.length === 0) {
    return (
      <div className="w-full flex justify-center text-sm text-zinc-400">
        {messages[Math.floor(Math.random() * messages.length)]}
      </div>
    )
  }

  return <>{children}</>
}

/**
 *
 */
export const TaskGroup = (props: {
  children: ReactNode[]
  label: string
  value: string
  labelType: string
  bg?: boolean
}) => {
  if (props.children.length === 0) return false

  return (
    <div className="pb-4" id={props.value} data-fetch-task-group={props.value}>
      <h1
        className={`text-sm sticky top-0 z-20 bg-white pb-1 border-b-[0.5px] ${props.bg ? "bg-white" : "bg-inherit"} ${props.labelType === "danger" && "text-rose-500"} ${props.labelType === "warning" && "text-orange-500"} ${props.labelType === "normal" && "text-zinc-500"}`}>
        {props.label}
      </h1>
      <div className="transition-all duration-200">{props.children}</div>
    </div>
  )
}
