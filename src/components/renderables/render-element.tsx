import isUrl from "is-url"
import { useEffect, useRef } from "react"
import { PiLink } from "react-icons/pi"

import { useApp } from "~contexts/app-context"
import { isUrlByRegex } from "~lib/task-helpers"
import type { IRepeatParams, IStore } from "~lib/types"

import {
  DateWithProps,
  IdentityWithProps,
  RepeatWithProps,
  TagsWithProps
} from "./render-params"
import { LabelStatus } from "./status"

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
  modifyDate: (dueDate: number) => void
  modifyRepeat: (repeatParams: IRepeatParams) => void
  removeIdentity: (id: number) => void
}

type IHeaderProps = Omit<IRenderElementProps, "type">

type ITextAreaProps = Omit<
  IRenderElementProps,
  "type" | "addDate" | "removeIdentity"
>

type ILinkProps = Omit<
  IRenderElementProps,
  "type" | "addDate" | "removeIdentity" | "store" | "index"
>

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

const HeaderWithProps = (props: IHeaderProps) => {
  const { store } = props
  const { editMode } = useApp()

  return (
    <div>
      <div className="w-full pl-4 pb-2">
        <div className="has-[:focus]:outline outline-2 outline-violet-900 w-full rounded-2xl flex">
          <input
            placeholder={editMode ? "LFG..." : "Click to start..."}
            type="text"
            ref={props.addToRef}
            className="
          w-full p-2 appearance-none rounded-lg bg-inherit
          font-bold text-xl leading-tight focus:text-2xl sm:focus:text-4xl sm:text-2xl 
          text-fetch-black dark:text-fetch-lightgray
          transition-all durration-100
          outline-none
          dark:placeholder-fetch-darkgray
          caret-fetch-primary"
            value={props.value}
            onPaste={props.onPaste}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
          />
          <div className="px-2 sm:flex items-center hidden">
            <LabelStatus taskCore={store} isEditor={true} />
          </div>
        </div>
      </div>

      {store.params.dueDate === -1 ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <DateWithProps
          timestamp={store.params.dueDate}
          setter={props.modifyDate}
        />
      )}
      {!store.params.repeatParams ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <RepeatWithProps
          repeatParams={store.params.repeatParams}
          setter={props.modifyRepeat}
        />
      )}

      {store.params.tags.length === 0 ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <TagsWithProps tags={store.params.tags} />
      )}

      {store.params.identities.length === 0 ? (
        <p className="h-0 pl-6 text-xs text-zinc-300"></p>
      ) : (
        <IdentityWithProps
          identities={store.params.identities}
          removeIdentity={props.removeIdentity}
        />
      )}
    </div>
  )
}

const LinkInputWithProps = (props: ILinkProps) => {
  return (
    <div className="flex items-center">
      <div className="w-4 text-blue-500">
        <PiLink />
      </div>
      <input
        placeholder="add link..."
        ref={props.addToRef}
        className={`${isUrl(props.value) || isUrlByRegex(props.value) ? "text-blue-500" : "text-zinc-500 dark:text-zinc-400"}
        leading-tight text-sm outline-none underline 
        w-full px-2 py-[2px] bg-inherit rounded-md resize-none overflow-y-hidden appearance-none
        focus:bg-zinc-100 dark:focus:bg-fetch-darkgray/40 
        hover:bg-zinc-50 dark:hover:bg-fetch-darkgray/30 
        `}
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
    <div className="flex items-center w-full">
      <div className="w-4 text-zinc-300 text-xs flex items-center justify-center">
        .
      </div>
      <textarea
        placeholder={
          props.index === 1 && props.value.length === 0
            ? "Type anything or press '/' for commands..."
            : ""
        }
        ref={_addToRef}
        className="
        w-full px-2 py-[2px] bg-inherit rounded-md resize-none overflow-y-hidden appearance-none outline-none
        focus:bg-zinc-100 dark:focus:bg-fetch-darkgray/40 
        hover:bg-zinc-50 dark:hover:bg-fetch-darkgray/30 
        text-zinc-500 dark:text-zinc-400 leading-tight text-sm
        "
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        onFocus={props.onFocus}
        onPaste={props.onPaste}
      />
    </div>
  )
}
