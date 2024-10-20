import isUrl from "is-url"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"
import { useEffect, useRef } from "react"
import { PiLinkThin } from "react-icons/pi"

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
  switch (type) {
    case "h":
      return <TitleّInputWithProps {...props} />

    case "p":
      return <ParagraphInputWithProps {...props} />

    case "a":
      return <LinkInputWithProps {...props} />
  }
}

interface ITitleProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

const TitleّInputWithProps = ({
  addToRef,
  onFocus,
  index,
  value,
  onChange,
  onKeyDown,
  onPaste
}: ITitleProps) => {
  return (
    <input
      placeholder="New task..."
      type="text"
      ref={addToRef}
      className="ml-4 w-full text-6xl p-2 font-bold leading-tight focus:bg-zinc-50 focus:outline-none rounded-lg"
      value={value}
      onPaste={onPaste}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={() => onFocus(index)}
    />
  )
}

interface ILinkProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

const LinkInputWithProps = ({
  addToRef,
  onFocus,
  index,
  value,
  onKeyDown,
  onChange,
  onPaste
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
    <div className="flex items-center">
      <div className="w-4 text-blue-500">
        <PiLinkThin />
      </div>
      <input
        placeholder="add link..."
        ref={addToRef}
        className={`text-sm w-full px-2 py-[2px] h-[20px] underline ${isUrl(value) ? "text-blue-500" : "text-zinc-400"} leading-tight focus:bg-zinc-100 focus:outline-none rounded-md`}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => onFocus(index)}
        onPaste={onPaste}
        // onClick={() => onFocus(index)}
      />
    </div>
  )
}

interface ITextAreaProps {
  addToRef: (el: HTMLElement) => void
  onFocus: Dispatch<SetStateAction<number>>
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

const ParagraphInputWithProps = ({
  addToRef,
  value,
  onChange,
  onKeyDown,
  onFocus,
  onPaste,
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
      placeholder={index === 0 ? "Let's aim..." : ""}
      ref={_addToRef}
      className="ml-4 text-zinc-500 text-sm w-full px-2 py-[2px] overflow-y-hidden leading-tight resize-none focus:bg-zinc-100 focus:outline-none rounded-md"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={() => onFocus(index)}
      onPaste={onPaste}
      // onClick={() => onFocus(index)}
    />
  )
}
