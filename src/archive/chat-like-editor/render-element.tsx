import isUrl from "is-url"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef } from "react"

interface RenderElementProps {
  type: string
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

export const RenderElement = ({ type, ...props }: RenderElementProps) => {
  if (type === "h") {
    return <TitleّInputWithProps {...props} />
  }
  if (type === "p") {
    return <ParagraphInputWithProps {...props} />
  }
  if (type === "a") {
    return <LinkInputWithProps {...props} />
  }
}

interface ITitleProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  // onKeyDown: (e: any) => void
  onChange: (e: any) => void
}

const TitleّInputWithProps = ({
  addToRef,
  onFocus,
  index,
  value,
  onChange
  // onKeyDown
}: ITitleProps) => {
  return (
    <input
      placeholder="Add title or Enter to skip..."
      type="text"
      ref={addToRef}
      className="w-full h-[36px] p-2 font-bold leading-tight focus:bg-zinc-50 focus:outline-none rounded-lg"
      value={value}
      onChange={onChange}
      // onKeyDown={onKeyDown}
      onFocus={() => onFocus(index)}
    />
  )
}

interface ILinkProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  // onKeyDown: (e: any) => void
  onChange: (e: any) => void
}

const LinkInputWithProps = ({
  addToRef,
  onFocus,
  index,
  value,
  // onKeyDown,
  onChange
}: ILinkProps) => {
  // if (isUrl(value)) {
  //   return (
  //     <a href={value} target="_blank" rel="noopener noreferrer">
  //       <input
  //         placeholder="add link..."
  //         ref={addToRef}
  //         className={`cursor-pointer w-full p-2 h-[36px] ${isUrl(value) ? "text-blue-600" : "text-zinc-500"} leading-tight focus:bg-zinc-50 focus:outline-none rounded-lg`}
  //         type="text"
  //         value={value}
  //         onChange={onChange}
  //         onKeyDown={onKeyDown}
  //         onFocus={() => onFocus(index)}
  //       />
  //     </a>
  //   )
  // } else
  return (
    <input
      placeholder="add link..."
      ref={addToRef}
      className={`text-sm w-full px-2 py-[2px] h-[20px] underline ${isUrl(value) ? "text-blue-500" : "text-zinc-400"} leading-tight focus:bg-zinc-50 focus:outline-none rounded-md`}
      type="text"
      value={value}
      onChange={onChange}
      // onKeyDown={onKeyDown}
      onFocus={() => onFocus(index)}
      // onClick={() => onFocus(index)}
    />
  )
}

interface ITextAreaProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  // onKeyDown: (e: any) => void
  onChange: (e: any) => void
  // onPaste: (e: any) => void
}

const ParagraphInputWithProps = ({
  addToRef,
  value,
  onChange,
  // onKeyDown,
  onFocus,
  // onPaste,
  index
}: ITextAreaProps) => {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.style.height = "18px"
    const h = ref?.current?.scrollHeight + "px"
    ref.current.style.height = h
  }, [value])

  const _addToRef = (el) => {
    addToRef(el)
    ref.current = el
  }

  return (
    <textarea
      placeholder="Let's aim..."
      ref={_addToRef}
      className="text-zinc-500 text-sm w-full px-2 py-[2px] overflow-y-hidden leading-tight resize-none focus:bg-zinc-100 focus:outline-none rounded-md"
      value={value}
      onChange={onChange}
      // onKeyDown={onKeyDown}
      onFocus={() => onFocus(index)}
      // onPaste={onPaste}
      // onClick={() => onFocus(index)}
    />
  )
}
