import type { ReactNode } from "react"

export default function InboxItemWrapper({
  children
}: {
  children: ReactNode
}) {
  return (
    <div
      className={`border-[1px] dark:border-zinc-500 border-zinc-400 hover:shadow-md rounded-md overflow-hidden`}>
      {children}
    </div>
  )
}
