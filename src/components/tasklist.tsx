import next from "next"
import { useEffect, useMemo, useState } from "react"
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


  const visibleTasks = useMemo(() => {
    const ONE_DAY = 24 * 60 * 60 * 1000
    const TWO_DAY = 48 * 60 * 60 * 1000

    const current = new Date().getTime()
    const unschaduled = []
    const next24 = []
    const next48 = []
    const overdue = []
    const other = []

    // if (tasks) {
    for (let task of tasks) {
      const { dueDate } = task.params

      if (dueDate === -1) {
        unschaduled.push(task)
      } else if (dueDate < current) {
        overdue.push(task)
      } else if (dueDate - ONE_DAY < current) {
        next24.push(task)
      } else if (dueDate - TWO_DAY < current) {
        next48.push(task)
      } else {
        other.push(task)
      }
    }
    // }

    return { overdue, unschaduled, next24, next48, other }
  }, [tasks])

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
          {drafts.length === 0 && tasks.length === 0 && (
            <div className="w-full font-bold text-xl text-zinc-300 text-center pt-12">
              Nothing to farm!
            </div>
          )}
          <TaskSubList
            title={"Drafts"}
            list={drafts}
            type="draft"
            name="draft"
          />
          <TaskSubList
            title={"Next 24 Hours"}
            list={visibleTasks.next24}
            type="task"
            name="next24"
          />
          <TaskSubList
            title={"Next 48 Hours"}
            list={visibleTasks.next48}
            type="task"
            name="next48"
          />
          <TaskSubList
            title={"Unscaduled"}
            list={visibleTasks.unschaduled}
            type="task"
            name="unschaduled"
          />
          <TaskSubList
            title={"Other"}
            list={visibleTasks.other}
            type="task"
            name="other"
          />
        </div>
      </div>
    </div>
  )
}
const TaskSubList = ({
  title,
  list,
  type,
  name
}: {
  title: string
  list: ITask[] | IDraft[]
  type: "task" | "draft"
  name: string
}) => {
  if (list.length > 0) {
    return (
      <div>
        <div className="text-sm sticky top-0 bg-white">
          <h1 className="pb-1 border-b-[0.5px]">{title}</h1>
        </div>

        {list.map((t: ITask | IDraft, i: number) => (
          <div className="py-1" key={`${name}-${i}`}>
            <TaskListItem item={t} type={type} />
          </div>
        ))}
      </div>
    )
  }
  return false
}
const TaskListItem = ({
  item,
  type
}: {
  item: ITask | IDraft
  type: "draft" | "task"
}) => {
  const { openEditMode, openViewMode } = useAppState()
  const { setDrafts } = useDraftContext()
  const { handleDone } = usePersistContext()

  const [show, setShow] = useState(false)
  const [opacity, setOpacity] = useState(0)

  const remove = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
    setShow(false)
    setOpacity(0)
  }

  useEffect(() => {
    if (show) setOpacity(1)
  }, [show])

  return (
    <div>
      {show === true && (
        <div
          onTransitionEnd={() => opacity == 0 && setShow(false)}
          style={{ height: `${opacity * 20}px`, opacity }}
          className="transition-all duration-200">
          <button
            className="hover:text-zinc-500 text-sm px-2"
            onClick={() => setOpacity(0)}>
            <IoCloseOutline />
          </button>
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
              onClick={() => remove(item.id)}>
              Delete
            </button>
          )}
        </div>
      )}

      <div
        onClick={() => opacity === 0 && setShow(true)}
        style={{
          borderRight: "5px solid blue",
          height: `${opacity === 0 ? "2.5rem" : `${24 * item.nodes.length + 40}px`}`
        }}
        className={`${type === "draft" ? "bg-[#f7f7f7]/50 border-[1px] border-dashed" : "border-[1px] bg-[#f7f7f7]"} 
                    ${!opacity ? "cursor-pointer" : "py-2"} 
                    text-xs border-r hover:shadow-md transition-all 
                    duration-200 flex flex-col px-2 rounded-md oveflow-y-hidden
                  `}>
        {show === false && (
          <div className="flex gap-2 items-center h-full px-2">
            {type === "task" && (
              <input
                checked={(item as ITask).done}
                type="checkbox"
                onChange={() => {
                  handleDone(item.id)
                  setShow(false)
                }}
              />
            )}
            <h2 className="font-bold flex-auto px-2">{item.nodes[0].value}</h2>
            {/* <Status store={task} isLoading={false} hasLoading={false} /> */}
          </div>
        )}
        {show === true && (
          <div
            style={{ opacity: opacity }}
            className={`w-full transition-all ${opacity === 1 ? "duration-500" : "duration-100"} flex gap-2 items-start px-2`}>
            {type === "task" && (
              <input
                className="mt-2"
                type="checkbox"
                onChange={() => {
                  handleDone(item.id)
                  setShow(false)
                }}
              />
            )}
            <div className="w-full">
              {item.nodes.map((n, i) => (
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
