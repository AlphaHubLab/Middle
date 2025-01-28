import { useVisibleTasks } from "~contexts/visible-tasks-context"
import type { ITask } from "~lib/types"

import { UpcomingItem } from "../items"
import { TaskGroup, TaskGroupWrapper } from "../task-group"

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
  // { label: "Wen do?", value: "unschaduled", variant: "neutral" },
  { label: "Other", value: "other", variant: "neutral" }
]

export const UpcomingList = () => {
  const visibleTasks = useVisibleTasks()

  return (
    <TaskGroupWrapper>
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
    </TaskGroupWrapper>
  )
}
