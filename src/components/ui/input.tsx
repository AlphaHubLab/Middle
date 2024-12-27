import type { ComponentProps } from "react"

type InputProps = ComponentProps<"input">

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`h-8 text-sm border appearence-none leading-tight p-1 rounded-md w-full ${className && className}`}
      {...props}
    />
  )
}
