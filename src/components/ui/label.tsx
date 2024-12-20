import type { ComponentProps } from "react"

type LabelProps = ComponentProps<"label">

export default function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={`text-sm text-zinc-600 py-1 ${className && className}`}
      {...props}>
      {children}
    </label>
  )
}
