import { useEffect, useState, type ReactNode } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { IoSquareOutline } from "react-icons/io5"

import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { useVisibleTasks } from "~contexts/visible-tasks-context"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { ITask, ITaskCore } from "~lib/types"

import { RenderAllElementsReadOnlyWithCopy } from "../editor/render-element-readonly"
import Status from "../editor/status"
import * as Collapsible from "../ui/collapsible"
import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"

// An Object to managing groups
const UPCOMMING_GROUP = [
  { label: "Overdue", value: "overdue", labelType: "danger" },
  { label: "So Close!", value: "urgent", labelType: "warning" },
  { label: "Next 24 Hours!", value: "next24", labelType: "normal" },
  { label: "Tomorrow", value: "next48", labelType: "normal" },
  { label: "Wen do?", value: "unschaduled", labelType: "normal" },
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
                  <div className="py-1" key={`${t.id}`}>
                    <UpcommingItem type="draft" item={t} />
                  </div>
                ))}
              </TaskGroup>
              {UPCOMMING_GROUP.map((group, i) => (
                <div key={`taskgroup-${i}`}>
                  <TaskGroup {...group}>
                    {visibleTasks[group.value].map((t: ITask, i: number) => (
                      <div className="py-1" key={`${t.id}`}>
                        <UpcommingItem type="task" item={t} />
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
    "To do or not to do - That is the question!",
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
        className={`text-sm sticky top-0 bg-white pb-1 border-b-[0.5px] ${props.bg ? "bg-white" : "bg-inherit"} ${props.labelType === "danger" && "text-rose-500"} ${props.labelType === "warning" && "text-orange-500"} ${props.labelType === "normal" && "text-zinc-500"}`}>
        {props.label}
      </h1>
      {props.children}
    </div>
  )
}

export const UpcommingItemWrapper = ({ type, isChecked, children }) => {
  const [style, setStyle] = useState({ width: "0%", transitionDuration: "2s" })

  useEffect(() => {
    if (!isChecked) setStyle({ width: "0%", transitionDuration: "0.3s" })
    else setStyle({ width: "100%", transitionDuration: "2s" })
  }, [isChecked])

  return (
    <div
      className={`relative h-full border-[1px] hover:shadow-md rounded-md flex flex-col justify-center
        ${type === "draft" ? "bg-[#f9f9f9] border-dashed" : "bg-[#f7f7f7]"}`}>
      <div className="relative z-10">{children}</div>
      <div
        style={style}
        className="z-0 transition-all duration-[2s] ease-in absolute h-full bg-emerald-500 rounded-md"></div>
    </div>
  )
}

const UpcommingItemWithCollapsible =
  Collapsible.withCollapsibleAndToolbar(UpcommingItemWrapper)

const UpcommingItem = ({
  item,
  type
}: {
  item: ITaskCore
  type: "task" | "draft"
}) => {
  const [checked, setChecked] = useState((item as ITask).done)

  const { handleDone } = usePersistContext()

  const handleCheck = () => setChecked(!checked)

  useEffect(() => {
    if (checked) {
    }
  }, [checked])
  return (
    <UpcommingItemWithCollapsible isChecked={checked}>
      <Collapsible.Toolbar>
        <TaskToolbar item={item} type={type} />
      </Collapsible.Toolbar>
      <Collapsible.Toggle>
        <div className="flex gap-2 items-center h-full px-2">
          {type === "task" && (
            <input checked={checked} type="checkbox" onChange={handleCheck} />
          )}
          <h2 className="font-bold flex-auto px-2">
            {getUpcommingPreview(item.nodes).value}
          </h2>
          <Status taskCore={item} isLoading={false} hasLoading={false} />
        </div>
      </Collapsible.Toggle>
      <Collapsible.Content>
        <div className="flex gap-2 px-2">
          <div className="">
            {type === "task" && (
              <input
                className="mt-2"
                type="checkbox"
                checked={checked}
                onChange={handleCheck}
              />
            )}
          </div>
          <div className="py-2">
            <RenderAllElementsReadOnlyWithCopy taskCore={item} />
          </div>
        </div>
      </Collapsible.Content>
    </UpcommingItemWithCollapsible>
  )
}

export const TaskToolbar = ({
  type,
  item
}: {
  item: ITaskCore
  type: "task" | "draft"
}) => {
  const { openEditMode, openViewMode } = useAppState()
  const { setDrafts } = useDraftContext()

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
  }

  return (
    <>
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
    </>
  )
}
