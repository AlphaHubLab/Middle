import { useEffect, useState } from "react"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
import { LabelStatus, TimeStatus } from "~components/editor/status"
import * as C from "~components/ui/collapsible"
import { usePersist } from "~contexts/persist-context"
import { useVisibleTasks } from "~contexts/visible-tasks-context"
import { fetchconfig } from "~fetch.config"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { ITask } from "~lib/types"

import InboxItemWrapper from "./inbox-item-wrapper"
import { TaskGroup, TaskGroupWrapper } from "./task-group"
import { TaskToolbar } from "./task-toolbar"

// An Object to manage groups
const UPCOMMING_GROUP: {
  label: string
  value: string
  labelType: "neutral" | "orange" | "red"
}[] = [
  { label: "Overdue", value: "overdue", labelType: "red" },
  { label: "So Close!", value: "urgent", labelType: "orange" },
  { label: "Next 24 Hours!", value: "next24", labelType: "neutral" },
  { label: "Tomorrow", value: "next48", labelType: "neutral" },
  { label: "Wen do?", value: "unschaduled", labelType: "neutral" },
  { label: "Other", value: "other", labelType: "neutral" }
]

export const UpcommingList = () => {
  const visibleTasks = useVisibleTasks()

  return (
    <TaskGroupWrapper>
      {UPCOMMING_GROUP.map((group) => (
        <TaskGroup key={`taskgroup-${group.label}`} {...group}>
          {visibleTasks[group.value].map((t: ITask) => (
            <UpcommingItem key={`${t.id}`} type="task" item={t} />
          ))}
        </TaskGroup>
      ))}
    </TaskGroupWrapper>
  )
}

const UpcommingItem = ({ type, item }) => {
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
    const timer = setTimeout(
      () => handleDone(item.id),
      fetchconfig.timers.done * 100
    )

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
    <div style={hidingStyle} className="transition-all py-[2px] sm:py-1">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-8 h-full justify-center items-center bg-fetch-secondary dark:bg-fetch-darkgray ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <input tabIndex={-1} type="checkbox" onChange={handleCheck} />
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-9 sm:h-10 relative bg-fetch-secondary dark:bg-fetch-darkgray hover:cursor-pointer select-none ${show && "border-b-[1px] dark:border-zinc-500"}`}>
              <div
                onTransitionEnd={slide}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-emerald-200 "></div>
              <div className="relative z-1 flex gap-2 items-center h-full">
                <h2 className="text-fetch-black dark:text-fetch-lightgray font-semibold text-sm flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
                <TimeStatus item={item} itemType="task" />
                <LabelStatus taskCore={item} />
              </div>
            </div>
          </C.Toggle>
          <C.Content>
            <div className="flex">
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
