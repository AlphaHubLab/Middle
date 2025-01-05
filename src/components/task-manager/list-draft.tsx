import { useEffect, useState } from "react"
import { PiTrash } from "react-icons/pi"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
import { LabelStatus, TimeStatus } from "~components/editor/status"
import * as C from "~components/ui/collapsible"
import { useDraftContext } from "~contexts/draft-context"
import { getUpcommingPreview } from "~lib/task-helpers"

import InboxItemWrapper from "./inbox-item-wrapper"
import { TaskGroupWrapper } from "./task-group"
import { TaskToolbar } from "./task-toolbar"

export const DraftList = () => {
  const { drafts } = useDraftContext()

  return (
    <TaskGroupWrapper>
      {drafts.map((t) => (
        <div key={`${t.id}`}>
          <DraftItem type="draft" item={t} />
        </div>
      ))}
    </TaskGroupWrapper>
  )
}

const DraftItem = ({ type, item }) => {
  const { setDrafts } = useDraftContext()

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
    setHidingStyle({
      transform: "translateX(200%)",
      maxHeight: "0px"
    })
  }

  return (
    <div style={hidingStyle} className="transition-all py-1">
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
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <h2 className="font-bold text-sm flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
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
