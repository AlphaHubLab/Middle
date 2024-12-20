import { useEffect } from "react"

import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { useVisibleTasks } from "~contexts/visible-tasks-context"
import type { ITask } from "~lib/types"

import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"
import {
  TaskGroup,
  TaskGroupWrapper,
  UpcommingItem
} from "./tasklist"

// An Object to manage groups
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
          )}
        </div>
      </div>
    </div>
  )
}
