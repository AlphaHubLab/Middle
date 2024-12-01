import { useEffect, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { IoCloseOutline, IoSquareOutline } from "react-icons/io5"

import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import type { IDraft, ITask } from "~lib/types"

import { RenderElementReadOnlyWithCopy } from "./editor/render-element-readonly"
// import Status from "./editor/status"
import { Handle } from "./ui/svgs/handle"

export default function TaskList({ show, setHide }) {
  const { tasks } = usePersistContext()
  const { drafts } = useDraftContext()

  return (
    <div
      dir="rtl"
      className={`absolute w-full h-full px-4 
        bg-white/80 transition-all duration-200
      `}>
      {!show && (
        <div
          onClick={() => setHide(false)}
          className="cursor-pointer w-full flex items-center justify-center">
          <Handle />
        </div>
      )}
      <div
        className={`relative styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-4`}>
        <div dir="ltr" className={`relative px-4 mb-4`}>
          {!show && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )}
          <div>
            <h1 className="pb-2 border-b-[0.5px] sticky top-0 bg-white/20 rounded-t-lg backdrop-blur-lg">
              Drafts
            </h1>
            {drafts.map((d, i) => (
              <div className="py-1" key={`draft-${i}`}>
                <TaskItem task={d} type="draft" />
              </div>
            ))}
          </div>
          <div>
            <h1 className="pb-2 border-b-[0.5px] sticky top-0 bg-white/20 backdrop-blur-lg">
              Tasks
            </h1>
            {tasks.map((t, i) => (
              <div className="py-1" key={`task-${i}`}>
                <TaskItem task={t} type="task" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TaskItem = ({
  task,
  type
}: {
  task: ITask | IDraft
  type: "draft" | "task"
}) => {
  const { goEditMode, goViewMode } = useAppState()
  const { setDrafts } = useDraftContext()
  const { handleDone } = usePersistContext()

  const [show, setShow] = useState(false)
  const [opacity, setOpacity] = useState(0)

  const remove = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
    setShow(false)
  }

  useEffect(() => {
    if (show) setOpacity(1)
    else setOpacity(0)
  }, [show])

  return (
    <div>
      {show === true && (
        <div
          style={{ height: `${opacity * 20}px`, opacity }}
          className="transition-all duration-200">
          <button
            className="hover:text-zinc-500 text-sm px-2"
            onClick={() => setShow(false)}>
            <IoCloseOutline />
          </button>
          {type === "task" && (
            <button
              className="hover:text-zinc-500 text-sm px-2"
              onClick={() => goViewMode(task as ITask)}>
              <IoSquareOutline />
            </button>
          )}
          <button
            className="hover:text-zinc-500 text-sm px-2"
            onClick={() => goEditMode(task)}>
            <AiOutlineEdit />
          </button>
          {type === "draft" && (
            <button
              className="text-rose-500 hover:text-rose-400 text-sm px-2"
              onClick={() => remove(task.id)}>
              Delete
            </button>
          )}
        </div>
      )}

      <div
        onClick={() => !show && setShow(true)}
        style={{
          borderRight: "5px solid blue",
          height: `${!show ? "2.5rem" : `${24 * task.nodes.length + 40}px`}`
        }}
        className={`$${type === "draft" && "border-[1px] borderr-dashed"} text-xs border-r hover:shadow-md transition-all 
                  duration-200 flex flex-col px-2 bg-[#f7f7f7] rounded-md
                  ${!show ? "cursor-pointer" : "py-2"}`}>
        {show === false && (
          <div className="flex gap-2 items-center h-full px-2">
            {type === "task" && (
              <input
                type="checkbox"
                onChange={() => {
                  handleDone(task.id)
                  setShow(false)
                }}
              />
            )}
            <h2 className="font-bold flex-auto">{task.nodes[0].value}</h2>
            {/* <Status store={task} isLoading={false} hasLoading={false} /> */}
          </div>
        )}
        {show === true && (
          <div
            // style={{ opacity: opacity }}
            className="w-full transition-all duration-300 flex gap-2 items-start px-2">
            {type === "task" && (
              <input
              className="mt-2"
                type="checkbox"
                onChange={() => {
                  handleDone(task.id)
                  setShow(false)
                }}
              />
            )}
            <div className="w-full">
            {task.nodes.map((n, i) => (
              <div key={`node-readonly-${i}`}>
                <RenderElementReadOnlyWithCopy {...n} />
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
