import { clearTimeout } from "timers"
import { useEffect, useState } from "react"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
// import Status from "~components/editor/status"
import { LabelStatus, TimeStatus } from "~components/editor/status"
import * as C from "~components/ui/collapsible"
import { useDraftContext } from "~contexts/draft-context"
// import { usePersistContext } from "~contexts/persisting-context"
import { fetchconfig } from "~fetch.config"
import { getUpcommingPreview } from "~lib/task-helpers"

import InboxItemWrapper from "./inbox-item-wrapper"
import { TaskGroup, TaskGroupWrapper } from "./task-group"
import { TaskToolbar } from "./task-toolbar"

export const DraftList = () => {
  const { drafts } = useDraftContext()

  return (
    <TaskGroupWrapper>
      <TaskGroup label={"Drafts"} value="draft" labelType="neutral">
        {drafts.map((t) => (
          <div key={`${t.id}`}>
            <DraftItem type="draft" item={t} />
          </div>
        ))}
      </TaskGroup>
    </TaskGroupWrapper>
  )
}

const DraftItem = ({ type, item }) => {
  const { setDrafts } = useDraftContext()

  const [show, setShow] = useState(false)
  const [down, setDown] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px"
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: fetchconfig.timers.delete + "s"
  })

  useEffect(() => {
    // let timer = null

    if (down) {
      setTimerStyle({
        width: "100%",
        transitionDuration: fetchconfig.timers.delete + "s"
      })
    } else {
      //   timer = setTimeout(() => setShowOverlay(false), 300)

      setTimerStyle({
        width: "0%",
        transitionDuration: fetchconfig.timers.cancel + "s"
      })
    }
  }, [down])

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return

    const timer = setTimeout(
      () => setDrafts((prev) => prev.filter((d) => d.id !== item.id)),
      fetchconfig.timers.delete * 100
    )

    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slideOrCanel = () => {
    if (timerStyle.width === "100%") {
      setHidingStyle({
        transform: "translateX(200%)",
        maxHeight: "0px"
      })
    } else {
      setShowOverlay(false)
    }
  }

  return (
    <div style={hidingStyle} className="transition-all py-1">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-8 h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"}`}>
              <div
                // onClick={() => setShowOverlay(!showOverlay)}
                onPointerDown={() => {
                  setDown(true)
                  setShowOverlay(!showOverlay)
                }}
                onPointerUp={() => {
                  setDown(false)
                  //   setShowOverlay(false)
                }}
                onPointerLeave={() => setDown(false)}
                role="button">
                D
              </div>
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div
                onTransitionEnd={slideOrCanel}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-rose-500"></div>
              {showOverlay && (
                <div className="absolute z-10 text-xs flex font-bold items-center justify-end px-2 h-full w-full left-0 top-0 text-rose-400 bg-white/50">
                  Hold to Delete
                </div>
              )}
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <h2 className="font-bold text-sm flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
                <TimeStatus item={item} itemType="task" />
                <LabelStatus taskCore={item} />
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
              <TaskToolbar item={item} type={type} />
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}
