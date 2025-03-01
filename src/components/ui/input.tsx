import type { ComponentProps } from "react"

type InputProps = ComponentProps<"input">

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`h-8 text-sm border appearence-none leading-tight py-1 px-2 rounded-xl outline-violet-400 w-full ${className && className}`}
      {...props}
    />
  )
}
