import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FiCopy } from "react-icons/fi"

export default function Copiable({
  children,
  textToCopy
}: {
  children: ReactNode
  textToCopy: string
}) {
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    if (!copy) return
    const timer = setTimeout(() => setCopy(false), 500)
    return () => clearTimeout(timer)
  }, [copy])

  return (
    <div className="flex w-full group hover:bg-zinc-200/30 items-center rounded-md">
      <div className="flex-auto">
        {/* <RenderElementReadOnly {...props} /> */}
        {children}
      </div>
      <div
        className={`text-sm ${copy ? "opacity-0 transition-all duration-700" : "opacity-1"} invisible group-hover:visible text-zinc-500 hover:text-zinc-400 hover:cursor-pointer px-2`}>
        <CopyToClipboard text={textToCopy} onCopy={() => setCopy(true)}>
          {!copy ? <FiCopy /> : <p className="text-xs">Copied</p>}
        </CopyToClipboard>
      </div>
    </div>
  )
}
