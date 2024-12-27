import { useEffect, useState } from "react"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
import Status from "~components/editor/status"
import {
  Checkbox,
  CollapsibleForTasks,
  Content,
  Toggle,
  Toolbar
} from "~components/ui/collapsible"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { useVisibleTasks } from "~contexts/visible-tasks-context"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { ITask } from "~lib/types"

import { TaskGroup, TaskGroupWrapper } from "./task-group"
import { TaskToolbar } from "./task-toolbar"

// An Object to manage groups
const UPCOMMING_GROUP = [
  { label: "Overdue", value: "overdue", labelType: "danger" },
  { label: "So Close!", value: "urgent", labelType: "warning" },
  { label: "Next 24 Hours!", value: "next24", labelType: "normal" },
  { label: "Tomorrow", value: "next48", labelType: "normal" },
  { label: "Wen do?", value: "unschaduled", labelType: "normal" },
  { label: "Other", value: "other", labelType: "normal" }
]

export const UpcommingList = () => {
  const { drafts } = useDraftContext()
  const visibleTasks = useVisibleTasks()
  return (
    <TaskGroupWrapper>
      <TaskGroup label={"Drafts"} value="draft" labelType="normal">
        {drafts.map((t) => (
          <div key={`${t.id}`}>
            <UpcommingItem type="draft" item={t} />
          </div>
        ))}
      </TaskGroup>
      {UPCOMMING_GROUP.map((group, i) => (
        <div key={`taskgroup-${i}`}>
          <TaskGroup {...group}>
            {visibleTasks[group.value].map((t: ITask) => (
              <div key={`${t.id}`}>
                <UpcommingItem type="task" item={t} />
              </div>
            ))}
          </TaskGroup>
        </div>
      ))}
    </TaskGroupWrapper>
  )
}

const UpcommingItem = ({ type, item }) => {
  const { handleDone } = usePersistContext()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px"
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: "1.5s"
  })

  const handleCheck = (e) => {
    if (!e.target.checked) {
      setTimerStyle({ width: "0%", transitionDuration: "0.3s" })
    } else {
      setTimerStyle({ width: "100%", transitionDuration: "1.5s" })
    }
  }

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(() => handleDone(item.id), 300)

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const hideFormList = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        transform: "translateX(200%)",
        maxHeight: "0px"
      })
  }
  return (
    <div style={hidingStyle} className="transition-all duration-300 py-1">
      <UpcommingItemWrapper>
        <CollapsibleForTasks show={show} setShow={setShow}>
          <Checkbox>
            <div
              className={`flex w-8 h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"}`}>
              <input type="checkbox" onChange={handleCheck} />
            </div>
          </Checkbox>
          <Toggle>
            <div
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div
                onTransitionEnd={hideFormList}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-emerald-200 "></div>
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <h2 className="font-bold text-sm flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
                <Status taskCore={item} isLoading={false} hasLoading={false} />
              </div>
            </div>
          </Toggle>
          <Content>
            <div className="flex">
              <div className="w-8"></div>
              <div className="overflow-y-auto styled-scrollbar h-content max-h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </Content>
          <Toolbar>
            <div className="bg-zinc-100 w-full border-t-[1px] h-[24px] flex items-center">
              <TaskToolbar item={item} type={type} />
            </div>
          </Toolbar>
        </CollapsibleForTasks>
      </UpcommingItemWrapper>
    </div>
  )
}

export const UpcommingItemWrapper = ({ children }) => {
  return (
    <div
      className={`border-[1px] hover:shadow-md rounded-md flex flex-col justify-center overflow-hidden`}>
      <div className="h-full w-full flex w-full">
        <div className=" w-full h-full">
          <div className=" w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
