import type { IButtonProps } from "./button-types"

const BASE_CLASS = "block py-1 w-full border rounded-xl h-8"

const VARIANT = {
  primary:
    "text-white/90 hover:bg-fetch-primary/80 bg-fetch-primary border-fetch-primary",
  red: "text-rose-500 hover:text-rose-400 border-rose-500 hover:bg-rose-100/50",
  blue: "text-blue-500 hover:text-blue-400 border-blue-500 hover:bg-blue-100/50"
}
export default function ButtonFull({
  variant,
  children,
  className,
  ...props
}: IButtonProps) {
  return (
    <button {...props} className={`${BASE_CLASS} ${VARIANT[variant]}`}>
      {children}
    </button>
  )
}
