import { useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FiCopy } from "react-icons/fi"

interface RenderElementProps {
  type: string
  value: string | number | readonly string[]
}

export const RenderElementReadOnly = ({
  type,
  ...props
}: RenderElementProps) => {
  if (type === "h") {
    return <TitleّReadOnlyWithProps {...props} />
  }
  if (type === "p") {
    return <ParagraphReadOnlyWithProps {...props} />
  }
  if (type === "a") {
    return <LinkReadOnlyWithProps {...props} />
  }
}

interface ITitleProps {
  value: string | number | readonly string[]
}

const TitleّReadOnlyWithProps = ({ value }: ITitleProps) => {
  return (
    <h1 className="w-full h-[36px] p-2 font-bold leading-tight rounded-md">
      {value}
    </h1>
  )
}

interface ILinkProps {
  value: string | number | readonly string[]
}

const LinkReadOnlyWithProps = ({ value }: ILinkProps) => (
  <div className="py-[2px] px-2 h-[20px]">
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm w-full underline text-blue-500 hover:text-blue-300 leading-tight rounded-md"
      href={value as string}>
      {value}
    </a>
  </div>
)

interface ITextAreaProps {
  value: string | number | readonly string[]
}

const ParagraphReadOnlyWithProps = ({ value }: ITextAreaProps) => {
  return (
    <p className="h-[20px] py-[2px] text-zinc-500 text-sm w-full px-2 overflow-y-hidden leading-tight rounded-md">
      {value}
    </p>
  )
}

export const RenderElementReadOnlyWithCopy = (props) => {
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    if (!copy) return
    const timer = setTimeout(() => setCopy(false), 500)
    return () => clearTimeout(timer)
  }, [copy])

  return (
    <div className="flex group hover:bg-zinc-200/70 items-center rounded-md">
      <div className="flex-auto">
        <RenderElementReadOnly {...props} />
      </div>
      <div
        className={`text-sm  ${copy ? "opacity-0 transition-all duration-700" : "opacity-1"} invisible group-hover:visible text-zinc-500 hover:text-zinc-400 hover:cursor-pointer px-2`}>
        <CopyToClipboard text={props.value} onCopy={() => setCopy(true)}>
          {!copy ? <FiCopy /> : <p className="text-xs">Copied</p>}
        </CopyToClipboard>
      </div>
    </div>
  )
}
