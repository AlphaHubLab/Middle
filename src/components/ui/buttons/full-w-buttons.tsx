import type { IButtonProps } from "./button-types"

const BASE_CLASS = "block py-2 w-full border rounded-xl"

const VARIANT = {
  primary:
    "disabled:bg-zinc-300 disabled:border-zinc-300 text-white/90 hover:bg-fetch-primary/80 bg-fetch-primary border-fetch-primary",
  red: "disabled:border-zinc-300 disabled:text-zinc-300 text-rose-500 hover:text-rose-400 border-rose-500 hover:bg-rose-100/50",
  blue: "disabled:border-zinc-300 disabled:text-zinc-300 text-blue-500 hover:text-blue-400 border-blue-500 hover:bg-blue-100/50"
}
export default function ButtonFull({
  variant,
  children,
  className,
  ...props
}: IButtonProps) {
  return (
    <button {...props} className={`flex items-center justify-center text-sm px-2 min-h-10 ${BASE_CLASS} ${VARIANT[variant]}`}>
      {children}
    </button>
  )
}
