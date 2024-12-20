import type { ComponentProps } from "react"

type InputProps = ComponentProps<"input">

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`text-sm border appearence-none leading-tight p-1 rounded w-full ${className && className}`}
      {...props}
    />
  )
}
