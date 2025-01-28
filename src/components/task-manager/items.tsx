import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { PiTrash } from "react-icons/pi"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
import { LabelStatus, TimeStatus } from "~components/editor/status"
import Checkbox from "~components/ui/checkbox"
import * as C from "~components/ui/collapsible"
import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"
import { useReference } from "~contexts/reference-context"
import { fetchconfig } from "~fetch.config"
import { getUpcomingPreview } from "~lib/task-helpers"
import type { ITask } from "~lib/types"

import { TaskToolbar } from "./task-actions/task-toolbar"

export const UpcomingItem = ({ type, item, variant }) => {
  const { handleDone } = usePersist()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
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
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(() => handleDone(item.id), 150)

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slide = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        transform: "translateX(200%)",
        maxHeight: "0px"
      })
  }

  return (
    <div style={hidingStyle} className="transition-all py-[3px]">
      <InboxItemWrapper variant={variant}>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-12 h-full justify-center items-center bg-inherit dark:bg-white/10 ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <Checkbox tabIndex={-1} onChange={handleCheck} />
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-[62px] relative bg-inherit dark:bg-white/10 hover:cursor-pointer select-none ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <div
                onTransitionEnd={slide}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-emerald-200 "></div>

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
                    className="h-[20px] rounded-full w-[20px] mr-3"></div>
                </div>
              </div>
            </div>
          </C.Toggle>
          <C.Content>
            <div className="flex bg-white">
              <div className="basis-8"></div>
              <div className="overflow-y-auto overflow-x-hidden styled-scrollbar h-content max-h-[176px] basis-full">
                <div className="py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-zinc-100 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar item={item} type={type} />
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
    maxHeight: "1000px"
  })

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return

    const timer = setTimeout(
      () => setDrafts((prev) => prev.filter((d) => d.id !== item.id)),
      150
    )

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slide = () => {
    // newEditor()
    setHidingStyle({
      transform: "translateX(200%)",
      maxHeight: "0px"
    })
  }

  return (
    <div style={hidingStyle} className="transition-all py-[3px]">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"} ${showWarning ? "transition-[width] duration-200 w-32" : "w-8"}`}>
              {!showWarning && (
                <button
                  aria-label="Delete"
                  className="w-8 flex items-center justify-center text-rose-500 hover:text-rose-400"
                  onClick={() => setShowWarning(true)}>
                  <PiTrash />
                </button>
              )}
              {showWarning && (
                <div className="text-xs flex font-bold items-center justify-start gap-4 px-2 h-full w-full text-rose-400 border-r-2 overflow-x-hidden">
                  <button
                    className="w-16 text-start text-blue-500"
                    onClick={() => setShowWarning(false)}>
                    Keep
                  </button>
                  <button
                    onClick={slide}
                    className="w-16 text-end text-rose-500">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </C.Action>
          <C.Toggle>
            <header
              className={`h-[62px] relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
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
              <div className="overflow-y-auto styled-scrollbar h-content max-h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-zinc-100 w-full border-t-[1px] h-[24px] flex items-center">
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
    maxHeight: "1000px"
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
    const timer = setTimeout(() => handleUndone(item.id), 150)
    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slide = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        transform: "translateX(200%)",
        maxHeight: "0px"
      })
  }

  return (
    <div style={hidingStyle} className="transition-all py-[3px]">
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
              <div className="overflow-y-auto styled-scrollbar h-content max-h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-zinc-100 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar item={item} type={"history"} />
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}

const wrapperClass = {
  neutral:
    "bg-slate-50 border-violet-900 shadow-violet-300 dark:border-violet-400/50 dark:shadow-violet-300/30",
  red: "bg-slate-50 border-rose-600/70 shadow-rose-600/70",
  orange: "bg-slate-50 border-orange-500/70 shadow-orange-400/70"
}

const InboxItemWrapper = ({
  children,
  variant = "neutral"
}: {
  children: ReactNode
  variant?: "neutral" | "orange" | "red"
}) => {
  return (
    <div
      className={`${wrapperClass[variant]} border hover:shadow-none shadow-[0px_2px] rounded-2xl overflow-hidden`}>
      {children}
    </div>
  )
}

const ItemView = ({ item }: { item: ITask }) => {
  if (!item.reference) {
    return (
      <>
        <h2 className="text-fetch-black flex items-center h-full font-semibold text-sm">
          {getUpcomingPreview(item.nodes).value}
        </h2>
        {/* <p className="text-xs text-zinc-400">project</p> */}
      </>
    )
  }
  return <ItemViewFromReference item={item} />
}

const ItemViewFromReference = ({ item }: { item: ITask }) => {
  const { references } = useReference()
  return (
    <h2 className="text-fetch-black flex items-center h-full font-semibold text-sm">
      {
        getUpcomingPreview(
          references.find((ref) => ref.id === item.reference).nodes
        ).value
      }
    </h2>
  )
}
