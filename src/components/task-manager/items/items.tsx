import { useDraft } from "~providers/draft-context"
import { usePersist } from "~providers/persist-context"
import { useRecurrence } from "~providers/recurrence-context"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { PiTrash } from "react-icons/pi"

import { RenderAllElementsReadOnlyWithCopy } from "~components/renderables/render-element-readonly"
import { LabelStatus, TimeStatus } from "~components/renderables/status"
import Checkbox from "~components/ui/checkbox"
import * as C from "~components/ui/collapsible"
import { fetchconfig } from "~fetch.config"
import {
  getDetailedPreview,
  getPreviewNodes,
  getUpcomingPreview
} from "~lib/task-helpers"
import type { ITask } from "~lib/types"

import { TaskToolbar } from "./task-toolbar"

const upcomingClass = {
  neutral: "border-black/10",
  red: "border-rose-600/70",
  orange: "border-rose-500/70"
}
export const UpcomingItem = ({ type, item, variant }) => {
  const { handleDone, setTasks } = usePersist()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    opacity: 1,
    transform: "none",
    maxHeight: "1000px"
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: fetchconfig.timers.done + "s"
  })

  const handleCheck = (e) => {
    if (!e.target.checked) {
      setTimerStyle({
        width: "0%",
        transitionDuration: fetchconfig.timers.cancel + "s"
      })
    } else {
      setTimerStyle({
        width: "100%",
        transitionDuration: fetchconfig.timers.done + "s"
      })
    }
  }

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px" && hidingStyle.maxHeight !== "1px")
      return

    const fn =
      hidingStyle.maxHeight === "0px"
        ? () => handleDone(item.id)
        : () => setTasks((prev) => prev.filter((task) => task.id !== item.id))

    const timer = setTimeout(fn, 200)

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slideToHistory = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        opacity: 0,
        transform: "translateX(50%)",
        maxHeight: "0px"
      })
  }

  const slideToDelete = () => {
    setHidingStyle({
      // transitionDuration: "500ms",
      opacity: 0,
      transform: "translateX(50%)",
      maxHeight: "1px"
    })
  }

  return (
    <div style={hidingStyle} className="transition-all duration-200 py-[3px]">
      <InboxItemWrapper variant={variant}>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-12 h-full justify-center items-center bg-inherit ${show && `border-b-[1px] ${upcomingClass[variant]}`}`}>
              <Checkbox tabIndex={-1} onChange={handleCheck} />
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-[62px] relative bg-inherit hover:cursor-pointer select-none ${show && `border-b-[1px] ${upcomingClass[variant]}`}`}>
              <div
                onTransitionEnd={slideToHistory}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-emerald-200 rounded-r-2xl"></div>

              <div className="relative z-1 h-full flex flex-col justify-center">
                <div className="flex gap-2 items-center h-full">
                  <div className="px-2 flex-auto">
                    <ItemView item={item} />
                  </div>
                  <TimeStatus item={item} itemType="task" />
                  <LabelStatus taskCore={item} />
                  <div
                    style={{
                      backgroundColor:
                        item.params.identities.length > 0
                          ? item.params.identities[0].color
                          : "inherit"
                    }}
                    className={`h-3 ${item.params.identities.length > 0 && "border"} rounded-full w-3 mr-3`}></div>
                </div>
              </div>
            </div>
          </C.Toggle>
          <C.Content>
            <div className="flex bg-white">
              <div className="basis-8"></div>
              <div className="overflow-y-auto overflow-x-hidden styled-scrollbar h-[176px] basis-full">
                <div className="py-2 w-full h-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-slate-50/50 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar
                slideToDelete={slideToDelete}
                item={item}
                type={type}
              />
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}

export const DraftItem = ({ type, item }) => {
  const { setDrafts } = useDraft()

  const [show, setShow] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px",
    opacity: 1
  })

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return

    const timer = setTimeout(
      () => setDrafts((prev) => prev.filter((d) => d.id !== item.id)),
      200
    )

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slideToDelete = () => {
    setHidingStyle({
      transform: "translateX(50%)",
      maxHeight: "0px",
      opacity: 0
    })
  }

  return (
    <div style={hidingStyle} className="transition-all duration-200 py-[3px]">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex h-full justify-center items-center bg-inherit ${show && "border-b-[1px]"} ${showWarning ? "transition-[width] duration-200 w-32" : "w-8"}`}>
              {!showWarning && (
                <button
                  aria-label="Delete"
                  className="w-8 flex items-center justify-center text-rose-500 hover:text-rose-400"
                  onClick={() => setShowWarning(true)}>
                  <PiTrash />
                </button>
              )}
              {showWarning && (
                <div className="text-xs flex font-medium items-center justify-start gap-4 px-2 h-full w-full text-rose-400 border-r-[1px] overflow-x-hidden">
                  <button
                    className="w-16 py-4 hover:text-blue-500/70 text-center text-blue-500"
                    onClick={() => setShowWarning(false)}>
                    Keep
                  </button>
                  <button
                    onClick={slideToDelete}
                    className="w-16 py-4 hover:text-rose-500/70 text-center text-rose-500">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </C.Action>
          <C.Toggle>
            <header
              className={`h-[62px] relative bg-inherit dark:bg-white/10 hover:cursor-pointer select-none ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <div className="px-2 flex-auto">
                  <ItemView item={item} />
                </div>
                <TimeStatus item={item} itemType="task" />
                <LabelStatus taskCore={item} />
              </div>
            </header>
          </C.Toggle>
          <C.Content>
            <div className="flex">
              <div className="w-8"></div>
              <div className="overflow-y-auto styled-scrollbar h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-slate-50/50 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar item={item} type={type} />
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}

export const HistoryItem = ({ item }) => {
  const { handleUndone } = usePersist()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px",
    opacity: 1
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: fetchconfig.timers.undone + "s"
  })

  const handleUncheck = (e) => {
    if (e.target.checked) {
      setTimerStyle({
        width: "0%",
        transitionDuration: fetchconfig.timers.cancel + "s"
      })
    } else {
      setTimerStyle({
        width: "100%",
        transitionDuration: fetchconfig.timers.undone + "s"
      })
    }
  }

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(() => handleUndone(item.id), 200)
    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slide = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        transform: "translateX(50%)",
        maxHeight: "0px",
        opacity: 0
      })
  }

  return (
    <div style={hidingStyle} className="transition-all duration-200 py-[3px]">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-12 h-full justify-center items-center bg-inherit dark:bg-white/10 ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <Checkbox defaultChecked tabIndex={-1} onChange={handleUncheck} />
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-[62px] relative bg-inherit dark:bg-white/10 hover:cursor-pointer select-none ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <div
                onTransitionEnd={slide}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-blue-200"></div>
              <div className="relative z-1 h-full flex flex-col justify-center">
                <div className="flex gap-2 items-center h-full">
                  <div className="px-2 flex-auto">
                    <ItemView item={item} />
                  </div>
                  <TimeStatus item={item} itemType="history" />
                  <LabelStatus taskCore={item} />
                  <div
                    style={{
                      backgroundColor:
                        item.params.identities.length > 0
                          ? item.params.identities[0].color
                          : "inherit"
                    }}
                    className="h-[20px] rounded-full w-[20px] mr-3"></div>
                </div>
              </div>
            </div>
          </C.Toggle>
          <C.Content>
            <div className="flex">
              <div className="w-8"></div>
              <div className="overflow-y-auto styled-scrollbar h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-slate-50/50 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar item={item} type={"history"} />
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}

const wrapperClass = {
  neutral: "bg-slate-50/50 hover:outline border-black/15",
  red: "bg-rose-100 border-rose-600/70 hover:outline hover:outline-rose-600",
  orange:
    "bg-orange-100 border-orange-500/70  hover:outline hover:outline-orange-500"
}

export const InboxItemWrapper = ({
  children,
  variant = "neutral"
}: {
  children: ReactNode
  variant?: "neutral" | "orange" | "red"
}) => {
  return (
    <div
      className={`${wrapperClass[variant]} border rounded-2xl overflow-hidden`}>
      {children}
    </div>
  )
}

const ItemView = ({ item }: { item: ITask }) => {
  const { recurrences } = useRecurrence()

  const nodes = getPreviewNodes(item, recurrences)
  const detailedPreview = getDetailedPreview(nodes)

  return (
    <>
      <h2 className="text-black/90 flex items-center h-full font-medium text-sm">
        {detailedPreview[0].value}
      </h2>
      <p className="text-xs text-black/50">{detailedPreview[1].value}</p>
    </>
  )
}

export const ItemBriefView = ({ item }: { item: ITask }) => {
  const { recurrences } = useRecurrence()

  const nodes = getPreviewNodes(item, recurrences)
  const briefPreview = getUpcomingPreview(nodes).value

  return (
    <h2 className="text-black/90 flex items-center h-full font-medium text-sm">
      {briefPreview}
    </h2>
  )
}
