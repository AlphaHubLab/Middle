import { Suspense } from "react"

import Loading from "~components/ui/loading"
import type { ITask } from "~lib/types"
import { useVisibleTasks } from "~providers/visible-tasks-provider"

import { UpcomingItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

// An Object to manage groups
const UPCOMMING_GROUP: {
  label: string
  value: string
  variant: "neutral" | "orange" | "red"
}[] = [
  { label: "Overdue", value: "overdue", variant: "red" },
  { label: "So Close!", value: "urgent", variant: "orange" },
  { label: "Next 24 Hours!", value: "next24", variant: "neutral" },
  { label: "Tomorrow", value: "next48", variant: "neutral" },
  { label: "Wen do?", value: "unschaduled", variant: "neutral" },
  { label: "Other", value: "other", variant: "neutral" }
]

export const UpcomingList = () => {
  const { visibleTasks } = useVisibleTasks()
  return (
    <TaskGroupWrapper>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loading r={20} color="#aaaaaa" />
          </div>
        }>
        {UPCOMMING_GROUP.map((group) => (
          <TaskGroup key={`taskgroup-${group.value}`} {...group}>
            {visibleTasks[group.value].map((t: ITask) => (
              <UpcomingItem
                key={`${t.id}`}
                type="task"
                item={t}
                variant={group.variant}
              />
            ))}
          </TaskGroup>
        ))}
      </Suspense>
    </TaskGroupWrapper>
  )
}
