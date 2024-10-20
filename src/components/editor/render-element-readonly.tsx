import type { Dispatch, SetStateAction } from "react"

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
    <h1 className="w-full h-[36px] p-2 font-bold leading-tight focus:bg-zinc-50 focus:outline-none rounded-lg">
      {value}
    </h1>
  )
}

interface ILinkProps {
  value: string | number | readonly string[]
}

const LinkReadOnlyWithProps = ({ value }: ILinkProps) => (
  <a
    className="text-sm w-full px-2 py-[2px] h-[20px] underline text-blue-500 leading-tight focus:bg-zinc-50 focus:outline-none rounded-md"
    href={value as string}>
    {value}
  </a>
)

interface ITextAreaProps {
  value: string | number | readonly string[]
}

const ParagraphReadOnlyWithProps = ({ value }: ITextAreaProps) => {
  return (
    <p className="h-[20px] text-zinc-500 text-sm w-full px-2 overflow-y-hidden leading-tight resize-none focus:bg-zinc-100 focus:outline-none rounded-md">
      {value}
    </p>
  )
}
