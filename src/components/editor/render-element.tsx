import isUrl from "is-url"
import { useEffect, useRef } from "react"
import { PiLinkThin } from "react-icons/pi"

import type { Store } from "~lib/types"

import { DateWithProps, TagsWithProps } from "./render-params"
import Status from "./status"

interface RenderElementProps {
  type: string
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
  store: Store
  isLoading: boolean
  addDate: (dueDate: number) => void
}

export const RenderElement = ({ type, ...props }: RenderElementProps) => {
  switch (type) {
    case "h":
      return <HeaderWithProps {...props} />

    case "p":
      return <ParagraphInputWithProps {...props} />

    case "a":
      return <LinkInputWithProps {...props} />
  }
}

interface IHeaderProps {
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  index: number
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
  isLoading: boolean
  addDate: (dueDate: number) => void
  store: Store
}

const HeaderWithProps = ({
  addToRef,
  onFocus,
  value,
  onChange,
  onKeyDown,
  onPaste,
  isLoading,
  store,
  addDate
}: IHeaderProps) => {
  return (
    <div>
      <div className="flex ml-4 w-[calc(100%-16px)] gap-2">
        <input
          placeholder="LFG..."
          type="text"
          ref={addToRef}
          className="text-4xl w-full p-2 font-bold appearance-none leading-tight focus:bg-zinc-50 focus:outline-none rounded-lg"
          value={value}
          onPaste={onPaste}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />
        <Status store={store} isLoading={isLoading} />
      </div>
      {store.params.dueDate === -1 ? (
        <p className="h-10 pl-6 text-xs text-zinc-300">No Due Date</p>
      ) : (
        <DateWithProps value={store.params.dueDate} setter={addDate} />
      )}
      {store.params.tags.length === 0 ? (
        <p className="h-10 pl-6 text-xs text-zinc-300">No Tags</p>
      ) : (
        <TagsWithProps tags={store.params.tags} />
      )}
    </div>
  )
}

interface ILinkProps {
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  value: string | number | readonly string[]
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

const LinkInputWithProps = ({
  addToRef,
  onFocus,
  value,
  onKeyDown,
  onChange,
  onPaste
}: ILinkProps) => {
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
        onFocus={onFocus}
        onPaste={onPaste}
        // onClick={() => onFocus(index)}
      />
    </div>
  )
}

interface ITextAreaProps {
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
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
  onPaste
}: ITextAreaProps) => {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.style.height = "18px"
    const h = ref?.current?.scrollHeight + "px"
    ref.current.style.height = h
  }, [value])

  const _addToRef = (el: HTMLElement) => {
    addToRef(el)
    ref.current = el
  }

  return (
    <textarea
      placeholder={"Let's aim..."}
      ref={_addToRef}
      className="appearance-none ml-4 w-calc[100%-16px] text-zinc-500 text-sm px-2 py-[2px] overflow-y-hidden leading-tight resize-none focus:bg-zinc-100 focus:outline-none rounded-md"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onPaste={onPaste}
    />
  )
}
