import { useEffect, useState, type ChangeEvent, type ReactNode } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { IoSquareOutline } from "react-icons/io5"

import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { ITask, ITaskCore } from "~lib/types"

import { RenderAllElementsReadOnlyWithCopy } from "../editor/render-element-readonly"
import Status from "../editor/status"
import * as Collapsible from "../ui/collapsible"

export const TaskGroupWrapper = ({ children }: { children: ReactNode[] }) => {
  const messages = [
    "To do or not to do - That is the question!",
    "Just nothing..."
  ]

  if (children.length === 0) {
    return (
      <div className="w-full flex justify-center text-sm text-zinc-400">
        {messages[Math.floor(Math.random() * messages.length)]}
      </div>
    )
  }

  return <>{children}</>
}

/**
 * 
 */
export const TaskGroup = (props: {
  children: ReactNode[]
  label: string
  value: string
  labelType: string
  bg?: boolean
}) => {
  if (props.children.length === 0) return false

  return (
    <div className="pb-4" id={props.value} data-fetch-task-group={props.value}>
      <h1
        className={`text-sm sticky top-0 z-20 bg-white pb-1 border-b-[0.5px] ${props.bg ? "bg-white" : "bg-inherit"} ${props.labelType === "danger" && "text-rose-500"} ${props.labelType === "warning" && "text-orange-500"} ${props.labelType === "normal" && "text-zinc-500"}`}>
        {props.label}
      </h1>
      <div className="transition-all duration-200">{props.children}</div>
    </div>
  )
}

/**
 * 
 */
export const UpcommingItemWrapper = ({ type, children, onTimerEnd }) => {
  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: "1.5s"
  })

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setTimerStyle({ width: "0%", transitionDuration: "0.3s" })
    } else {
      setTimerStyle({ width: "100%", transitionDuration: "1.5s" })
    }
  }

  return (
    <div
      className={`border-[1px] hover:shadow-md rounded-md flex flex-col justify-center
          ${type === "draft" ? "bg-[#f9f9f9] border-dashed" : "bg-[#f7f7f7]"}`}>
      <div className="h-full w-full flex w-full">
        {type === "task" && (
          <div className="flex w-8 h-10 justify-center items-center">
            <input type="checkbox" onChange={handleCheck} />
          </div>
        )}
        <div className="relative w-full h-full">
          <div
            onTransitionEnd={() => timerStyle.width === "100%" && onTimerEnd()}
            style={timerStyle}
            className="z-0 transition-[width] left-0 top-0 ease-in absolute h-full bg-emerald-200 rounded-r-md"></div>
          <div className="relative z-1 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 *
 */
const UpcommingItemWithCollapsible =
  Collapsible.withCollapsibleAndToolbar(UpcommingItemWrapper)

/**
 *
 */
export const UpcommingItem = ({
  item,
  type
}: {
  item: ITaskCore
  type: "task" | "draft"
}) => {
  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px"
  })

  const { handleDone } = usePersistContext()

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(() => handleDone(item.id), 300)

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  return (
    <div style={hidingStyle} className="transition-all duration-300 py-1">
      <UpcommingItemWithCollapsible
        item={item}
        type={type}
        onTimerEnd={() =>
          setHidingStyle({
            transform: "translateX(200%)",
            maxHeight: "0px"
          })
        }>
        <Collapsible.Toolbar>
          <TaskToolbar item={item} type={type} />
        </Collapsible.Toolbar>
        <Collapsible.Toggle>
          <div className="flex gap-2 items-center h-full px-2">
            <h2 className="font-bold flex-auto px-2">
              {getUpcommingPreview(item.nodes).value}
            </h2>
            <Status taskCore={item} isLoading={false} hasLoading={false} />
          </div>
        </Collapsible.Toggle>
        <Collapsible.Content>
          <div className="flex gap-2 px-2 py-2">
            <RenderAllElementsReadOnlyWithCopy taskCore={item} />
          </div>
        </Collapsible.Content>
      </UpcommingItemWithCollapsible>
    </div>
  )
}

/**
 * 
 */
export const TaskToolbar = ({
  type,
  item
}: {
  item: ITaskCore
  type: "task" | "draft"
}) => {
  const { openEditMode, openViewMode } = useAppState()
  const { setDrafts } = useDraftContext()

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
  }

  return (
    <>
      {type === "task" && (
        <button
          className="hover:text-zinc-500 text-sm px-2"
          onClick={() => openViewMode(item as ITask)}>
          <IoSquareOutline />
        </button>
      )}
      <button
        className="hover:text-zinc-500 text-sm px-2"
        onClick={() => openEditMode(item, type)}>
        <AiOutlineEdit />
      </button>
      {type === "draft" && (
        <button
          className="text-rose-500 hover:text-rose-400 text-sm px-2"
          onClick={() => removeDraft(item.id)}>
          Delete
        </button>
      )}
    </>
  )
}
