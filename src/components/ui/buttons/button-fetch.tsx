import type { ComponentProps } from "react"

export type ButtonFetchProps = ComponentProps<"button"> & {
  variant: "primary" | "neutral" | "green" | "blue" | "orange" | "red"
}

export const BUTTON_BASE_CLASS = {
  neutral: {
    parent: "text-zinc-700 hover:text-zinc-500",
    child: "text-zinc-700 group-hover:text-zinc-500"
  },

  primary: {
    parent: "text-zinc-700 hover:text-zinc-500",
    child: "text-zinc-700 group-hover:text-zinc-500"
  },

  blue: {
    parent: "text-blue-500 hover:text-blue-300",
    child: "text-blue-500 group-hover:text-blue-300"
  },
  green: {
    parent: "text-emerald-500 hover:text-emerald-300",
    child: "text-emerald-500 group-hover:text-emerald-300"
  },
  orange: {
    parent: "text-orange-500 hover:text-orange-300",
    child: "text-orange-500 group-hover:text-orange-300"
  },
  red: {
    parent: "text-rose-500 hover:text-rose-300",
    child: "text-rose-500 group-hover:text-rose-300"
  }

  //   hidden:

  //   warning:
}

export default function ButtonFetch({
  className,
  children,
  variant,
  ...props
}: ButtonFetchProps) {
  return (
    <button
      className={`disabled:text-zinc-300 flex items-center justify-center transition-all group px-1 hover:px-0 ${BUTTON_BASE_CLASS[variant].parent} ${className && className}`}
      {...props}>
      {"("}
      <div
        className={`transition-all px-0 pt-[2px] group-hover:px-1 group-disabled:text-zinc-300 ${BUTTON_BASE_CLASS[variant].child}`}>
        {children}
      </div>
      {")"}
    </button>
  )
}
