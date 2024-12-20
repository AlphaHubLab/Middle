import type { ComponentProps } from "react"

export type ButtonFetchProps = ComponentProps<"button"> & {
  variant: "primary" | "secondary" | "warning" | "danger" | "hiddden"
}

export const BUTTON_BASE_CLASS = {
  primary: {
    parent:
      "disabled:text-zinc-300 text-zinc-700 hover:text-zinc-500 flex items-center justify-center transition-all group px-2 hover:px-0",
    child:
      "transition-all text-zinc-700 px-0 pt-[2px] group-hover:px-2 group-hover:text-zinc-500 group-disabled:text-zinc-300"
  }

  //   secondary:

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
      className={` ${BUTTON_BASE_CLASS[variant].parent} ${className && className}`}
      {...props}>
      {"("}
      <div className={BUTTON_BASE_CLASS[variant].child}>{children}</div>
      {")"}
    </button>
  )
}
