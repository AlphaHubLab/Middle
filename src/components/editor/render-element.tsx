import isUrl from "is-url"
import { useEffect, useRef } from "react"
import { PiLinkThin } from "react-icons/pi"

import useDraft from "~hooks/useDraft"
import { isTaskEmpty } from "~lib/task-helpers"
import type { IStore } from "~lib/types"

import { DateWithProps, TagsWithProps } from "./render-params"
import Status from "./status"

interface IRenderElementProps {
  type: string
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  index: number
  value: string
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
  store: IStore
  addDate: (dueDate: number) => void
}

export const RenderElement = ({ type, ...props }: IRenderElementProps) => {
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
  value: string
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
  addDate: (dueDate: number) => void
  store: IStore
}

const HeaderWithProps = (props: IHeaderProps) => {
  const { store } = props
  const { isLoading } = useDraft(store)

  return (
    <div>
      <div className="flex ml-4 w-[calc(100%-16px)] gap-2">
        <input
          placeholder="LFG..."
          type="text"
          ref={props.addToRef}
          className="hover:bg-zinc-50 text-4xl w-full p-2 font-bold appearance-none leading-tight focus:bg-zinc-100 focus:outline-none rounded-lg"
          value={props.value}
          onPaste={props.onPaste}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
          onFocus={props.onFocus}
        />
        <Status taskCore={store} isLoading={isLoading} isEditor={true} />
      </div>

      {store.params.dueDate === -1 ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <DateWithProps value={store.params.dueDate} setter={props.addDate} />
      )}

      {store.params.tags.length === 0 ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <TagsWithProps tags={store.params.tags} />
      )}
    </div>
  )
}

interface ILinkProps {
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  value: string
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
}

const LinkInputWithProps = (props: ILinkProps) => {
  return (
    <div className="flex items-center">
      <div className="w-4 text-blue-500">
        <PiLinkThin />
      </div>
      <input
        placeholder="add link..."
        ref={props.addToRef}
        className={`hover:bg-zinc-50 text-sm w-full px-2 py-[2px] h-[20px] underline ${isUrl(props.value) ? "text-blue-500" : "text-zinc-400"} leading-tight focus:bg-zinc-100 focus:outline-none rounded-md`}
        type="text"
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        onFocus={props.onFocus}
        onPaste={props.onPaste}
        // onClick={() => onFocus(index)}
      />
    </div>
  )
}

interface ITextAreaProps {
  addToRef: (el: HTMLElement) => void
  onFocus: () => void
  value: string
  onKeyDown: (e: any) => void
  onChange: (e: any) => void
  onPaste: (e: any) => void
  index: number
  store: IStore
}

const ParagraphInputWithProps = (props: ITextAreaProps) => {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.style.height = "18px"
    const h = ref?.current?.scrollHeight + "px"
    ref.current.style.height = h
  }, [props.value])

  const _addToRef = (el: HTMLElement) => {
    props.addToRef(el)
    ref.current = el
  }

  return (
    <textarea
      placeholder={
        props.index === 1 && isTaskEmpty(props.store, "loose")
          ? "Let's aim..."
          : ""
      }
      ref={_addToRef}
      className="hover:bg-zinc-50 appearance-none ml-4 w-calc[100%-16px] text-zinc-500 text-sm px-2 py-[2px] overflow-y-hidden leading-tight resize-none focus:bg-zinc-100 focus:outline-none rounded-md"
      value={props.value}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      onFocus={props.onFocus}
      onPaste={props.onPaste}
    />
  )
}
