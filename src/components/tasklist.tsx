import { Children, useEffect, useMemo, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { IoCloseOutline, IoSquareOutline } from "react-icons/io5"

import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { IDraft, ITask } from "~lib/types"

import { RenderElementReadOnlyWithCopy } from "./editor/render-element-readonly"
import Status from "./editor/status"
import { Handle } from "./ui/svgs/handle"

const filterTasks = (tasks: ITask[]) => {
  const ONE_HOUR = 1 * 60 * 60 * 1000
  const ONE_DAY = 24 * 60 * 60 * 1000
  const TWO_DAY = 48 * 60 * 60 * 1000

  const current = new Date().getTime()

  const unschaduled: ITask[] = []
  const urgent: ITask[] = []
  const next24: ITask[] = []
  const next48: ITask[] = []
  const overdue: ITask[] = []
  const other: ITask[] = []

  for (let task of tasks) {
    const { dueDate } = task.params

    if (dueDate === -1) {
      unschaduled.push(task)
    } else if (dueDate < current) {
      overdue.push(task)
    } else if (dueDate - ONE_HOUR < current) {
      urgent.push(task)
    } else if (dueDate - ONE_DAY < current) {
      next24.push(task)
    } else if (dueDate - TWO_DAY < current) {
      next48.push(task)
    } else {
      other.push(task)
    }
  }

  return {
    overdue: overdue.sort((a, b) => a.params.dueDate - b.params.dueDate),
    urgent:urgent.sort((a, b) => a.params.dueDate - b.params.dueDate),
    unschaduled,
    next24:next24.sort((a, b) => a.params.dueDate - b.params.dueDate),
    next48,
    other
  }
}

export default function TaskList({ show, setHide }) {
  const { tasks } = usePersistContext()
  const { drafts } = useDraftContext()

  const visibleTasks = useMemo(() => filterTasks(tasks), [tasks])

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth"
        })
      })
    })
  }, [])

  return (
    <div
      dir="rtl"
      className="absolute w-full h-full px-4 bg-white/80 transition-all duration-200">
      {show === false && (
        <div
          onClick={() => setHide(false)}
          className="cursor-pointer w-full flex items-center justify-center">
          <Handle />
        </div>
      )}
      <div
        className={`relative styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-4`}>
        {/* <a href="#other">OTHER</a> */}
        <div dir="ltr" className="relative px-4 mb-4">
          {show === false && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )}
          {drafts.length === 0 && tasks.length === 0 && (
            <div className="w-full font-bold text-xl text-zinc-300 text-center pt-12">
              Nothing to farm!
            </div>
          )}
          <TaskGroup
            group={"Drafts"}
            items={drafts}
            type="draft"
            name="draft"
          />
          <TaskGroup
            group={"Overdues"}
            items={visibleTasks.overdue}
            type="task"
            name="overdue"
            isOverdue
          />
          <TaskGroup
            group={"So close!"}
            items={visibleTasks.urgent}
            type="task"
            name="urgent"
          />
          <TaskGroup
            group={"Next 24 Hours"}
            items={visibleTasks.next24}
            type="task"
            name="next24"
          />
          <TaskGroup
            group={"Next 48 Hours"}
            items={visibleTasks.next48}
            type="task"
            name="next48"
          />
          <TaskGroup
            group={"Unschaduled"}
            items={visibleTasks.unschaduled}
            type="task"
            name="unschaduled"
          />
          <TaskGroup
            group={"Other"}
            items={visibleTasks.other}
            type="task"
            name="other"
          />
        </div>
      </div>
    </div>
  )
}
const TaskGroup = ({
  group,
  items,
  type,
  name,
  isOverdue = false
}: {
  group: string
  items: Array<ITask | IDraft>
  type: "task" | "draft"
  name: string
  isOverdue?: boolean
}) => {
  if (items.length > 0) {
    return (
      <div className="pb-4" id={name}>
        <div className="text-sm sticky top-0 bg-white">
          <h1
            className={`pb-1 border-b-[0.5px] ${isOverdue && "text-rose-500"}`}>
            {group}
          </h1>
        </div>
        {items.map((t, i) => (
          <div className="py-1" key={`${name}-${i}`}>
            <TaskItem item={t} type={type} />
          </div>
        ))}
      </div>
    )
  }
  return false
}
const TaskItem = ({
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
  const [animState, setAnimState] = useState(0)

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
    setShow(false)
    setAnimState(0)
  }

  useEffect(() => {
    if (show) setAnimState(1)
  }, [show])

  return (
    <div>
      {show === true && (
        <div
          onTransitionEnd={() => animState == 0 && setShow(false)}
          style={{ height: `${animState * 20}px`, opacity: animState }}
          className="transition-all duration-200">
          <button
            className="hover:text-zinc-500 text-sm px-2"
            onClick={() => setAnimState(0)}>
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
              onClick={() => removeDraft(item.id)}>
              Delete
            </button>
          )}
        </div>
      )}

      <div
        onClick={() => animState === 0 && setShow(true)}
        style={{
          borderRight: "5px solid blue",
          height: `${animState === 0 ? "2.5rem" : `${20 * (item.nodes.length - 1) + 36 + 20}px`}`
        }}
        className={`
                    ${!animState ? "cursor-pointer" : "py-2"} 
                    ${type === "draft" ? "bg-[#f9f9f9] border-[1px] border-dashed" : "border-[1px] bg-[#f7f7f7]"} 
                    text-xs border-r hover:shadow-md transition-all 
                    duration-200 flex flex-col px-2 rounded-md oveflow-y-hidden
                  `}>
        {show === false && (
          // <div>
          //   {item.params.dueDate !== -1 && (
          //     <p>{new Date(item.params.dueDate).toLocaleDateString()}</p>
          //   )}
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
            <h2 className="font-bold flex-auto px-2">
              {getUpcommingPreview(item.nodes).value}
            </h2>
            <Status store={item} isLoading={false} hasLoading={false} />
          </div>
          // </div>
        )}
        {show === true && (
          <div
            style={{ opacity: animState }}
            className={`w-full transition-all ${animState === 1 ? "duration-500" : "duration-100"} flex gap-2 items-start px-2`}>
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

const Itemm = ({ children }) => {
  const [show, setShow] = useState(false)

  return (
    <div onClick={() => setShow(true)}>
      <ExpandableItem show={show}>{children}</ExpandableItem>
    </div>
  )
}

const ExpandableItem = ({ show, children }) => {
  const [animState, setAnimState] = useState(0)

  const nodes = Children.toArray(children)

  useEffect(() => {
    if (show === true) setAnimState(1)
  }, [show])

  return (
    <div
      className={`${show === false ? "cursor-pointer" : "py-2"} transition-all duration-200`}
      style={{ height: `${animState === 0 ? "auto" : "auto"}` }}>
      {show === false ? (
        <div>{nodes[0]}</div>
      ) : (
        <div
          className={`w-full transition-all ${animState === 1 ? "duration-500" : "duration-100"}`}
          style={{ opacity: animState }}>
          {nodes}
        </div>
      )}
    </div>
  )
}
