import type { ITask } from "~lib/types"
import { useVisibleTasks } from "~providers/visible-tasks-provider"

import { DraftItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

export default function NoteList() {
  const { visibleTasks } = useVisibleTasks()

  return (
    <TaskGroupWrapper>
      <TaskGroup label="Note" value="note" variant="neutral">
        {visibleTasks.unschaduled.map((t: ITask) => (
          <DraftItem key={`${t.id}`} type="task" item={t} />
        ))}
      </TaskGroup>
    </TaskGroupWrapper>
  )
}
