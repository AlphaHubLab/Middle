import type { ComponentProps } from "react"

export type ButtonProps = ComponentProps<"button"> & {
  variant: "pri" | "sec" | "wrn" | "hid"
}

export const BUTTON_BASE_CLASS = {
  primary:
    "disabled:bg-zinc-400 disabled:border-zinc-400 transition duration-200 border border-black text-white bg-gray-900/90 hover:bg-gray-900/60 text-sm py-2 px-4 focus:outline-none focus:shadow-outline",
  secondary:
    "disabled:bg-zinc-400 disabled:border-zinc-400 transition duration-200 border border-black text-white bg-gray-900/90 hover:bg-gray-900/60 text-sm py-2 px-4 focus:outline-none focus:shadow-outline",
  hidden:
    "disabled:bg-zinc-400 disabled:border-zinc-400 transition duration-200 border border-black text-white bg-gray-900/90 hover:bg-gray-900/60 text-sm py-2 px-4 focus:outline-none focus:shadow-outline",
  warning:
    "disabled:bg-zinc-400 disabled:border-zinc-400 transition duration-200 border border-black text-white bg-gray-900/90 hover:bg-gray-900/60 text-sm py-2 px-4 focus:outline-none focus:shadow-outline"
}

export default function Button({
  className,
  children,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variant && BUTTON_BASE_CLASS[variant]} ${className && className}`}>
      {children}
    </button>
  )
}
