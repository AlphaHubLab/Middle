import type { ComponentProps } from "react"

export type WidgetProps = ComponentProps<"div">

export default function WidgetBox({
  children,
  className,
  ...props
}: WidgetProps) {
  return (
    <div
      {...props}
      className={`p-2 rounded-xl w-full h-full overflow-y-auto ${className && className}`}>
      {children}
    </div>
  )
}
