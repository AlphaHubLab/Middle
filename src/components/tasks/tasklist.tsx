import { useEffect, useState, type ElementType, type ReactNode } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { IoCloseOutline, IoSquareOutline } from "react-icons/io5"

import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { useVisibleTasks } from "~contexts/visible-tasks-context"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { ITask, ITaskCore } from "~lib/types"

import { RenderAllElementsReadOnlyWithCopy } from "../editor/render-element-readonly"
import Status from "../editor/status"
import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"

const UPCOMMING_GROUP = [
  { label: "Overdue", value: "overdue", labelType: "danger" },
  { label: "So Close!", value: "urgent", labelType: "warning" },
  { label: "Next 24 Hours!", value: "next24", labelType: "normal" },
  { label: "Tomorrow", value: "next48", labelType: "normal" },
  { label: "Other", value: "other", labelType: "normal" }
]

export default function TaskList({ show, setHide }) {
  const { drafts } = useDraftContext()
  const visibleTasks = useVisibleTasks()
  const { storageLoading } = usePersistContext()

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()

        document.querySelector(anchor.getAttribute("href")).scrollIntoView({
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
        <a href="#other">OTHER</a>
        <div dir="ltr" className="relative px-4 mb-4">
          {show === false && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )}
          {storageLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loading r={20} color="#aaaaaa" />
            </div>
          ) : (
            <TaskGroupWrapper>
              <TaskGroup label={"Drafts"} value="draft" labelType="normal">
                {drafts.map((t, i) => (
                  <div className="py-1" key={`drafts-${i}`}>
                    <TaskItemWithUpcommingWrapper item={t} type="draft" />
                  </div>
                ))}
              </TaskGroup>
              {UPCOMMING_GROUP.map((group, i) => (
                <div key={`taskgroup-${i}`}>
                  <TaskGroup {...group}>
                    {visibleTasks[group.value].map((t: ITask, i: number) => (
                      <div className="py-1" key={`${group.value}-${i}`}>
                        <TaskItemWithUpcommingWrapper item={t} type="task" />
                      </div>
                    ))}
                  </TaskGroup>
                </div>
              ))}
            </TaskGroupWrapper>
          )}
        </div>
      </div>
    </div>
  )
}

const TaskGroupWrapper = ({ children }: { children: ReactNode[] }) => {
  const messages = [
    "To do or not to do-That is the question!",
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
        className={`text-sm sticky top-0 bg-white pb-1 border-b-[0.5px]
                  ${props.bg ? "bg-white" : "bg-inherit"} 
                  ${props.labelType === "danger" && "text-rose-500"}
                  ${props.labelType === "warning" && "text-orange-500"}
                  ${props.labelType === "normal" && "text-zinc-500"}
               `}>
        {props.label}
      </h1>
      {props.children}
    </div>
  )
}

export const UpcommingItem = ({ type, children }) => {
  return (
    <div
      className={`h-full border-[1px] hover:shadow-md rounded-md flex flex-col justify-center
        ${type === "draft" ? "bg-[#f9f9f9] border-dashed" : "bg-[#f7f7f7]"}`}>
      {children}
    </div>
  )
}

export const SearchedItem = ({ children }) => {
  return (
    <div
      className={`h-full border-b-[1px] hover:bg-zinc-300 flex flex-col justify-center`}>
      {children}
    </div>
  )
}

export const TaskActionBar = ({
  type,
  animState,
  setShow,
  setAnimState,
  item
}) => {
  const { openEditMode, openViewMode } = useAppState()
  const { setDrafts } = useDraftContext()

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
    setShow(false)
    setAnimState(0)
  }

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
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
  )
}

export const withWrapper = (Wrapper: ElementType) => {
  return ({ type, item }: { type: "draft" | "task"; item: ITaskCore }) => {
    const { handleDone } = usePersistContext()

    const [show, setShow] = useState(false)
    const [animState, setAnimState] = useState(0)

    const handleCheck = () => {
      handleDone(item.id)
      setAnimState(0)
      setShow(false)
    }

    useEffect(() => {
      if (show) setAnimState(1)
    }, [show])

    return (
      <div>
        {show && (
          <TaskActionBar
            setShow={setShow}
            setAnimState={setAnimState}
            animState={animState}
            item={item}
            type={type}
          />
        )}

        <div
          onClick={() => setShow(true)}
          // height is equal to
          // 36px for title
          // 20px per each node
          // 10px for due date
          // 20px for paddding
          style={{
            borderRight: "5px solid blue",
            height: `${animState === 0 ? "2.5rem" : `${66 + 20 * (item.nodes.length - 1)}px`}`
          }}
          className={`transition-[height] duration-200 oveflow-y-hidden text-xs 
                      ${animState === 0 && "cursor-pointer"}
                    `}>
          <Wrapper type={type}>
            {!show && (
              <div className="flex gap-2 items-center h-full px-2">
                {type === "task" && (
                  <input
                    checked={(item as ITask).done}
                    type="checkbox"
                    onChange={handleCheck}
                  />
                )}
                <h2 className="font-bold flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
                <Status taskCore={item} isLoading={false} hasLoading={false} />
              </div>
            )}
            {show && (
              <div
                style={{ opacity: animState }}
                className={`w-full transition-all ${animState === 1 ? "duration-500" : "duration-100"} flex gap-2 items-start px-2`}>
                {type === "task" && (
                  <input
                    className="mt-2"
                    type="checkbox"
                    checked={(item as ITask).done}
                    onChange={handleCheck}
                  />
                )}
                <RenderAllElementsReadOnlyWithCopy taskCore={item} />
              </div>
            )}
          </Wrapper>
        </div>
      </div>
    )
  }
}

export const TaskItemWithUpcommingWrapper = withWrapper(UpcommingItem)
export const TaskItemWithSearchedWrapper = withWrapper(SearchedItem)
