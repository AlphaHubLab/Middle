import type { ITask } from "~lib/types"
import { useSetting } from "~providers/setting-provider"
import { useVisibleTasks } from "~providers/visible-tasks-provider"

import { DraftItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

export default function NoteList() {
  const { visibleTasks } = useVisibleTasks()
  const { setting } = useSetting()

  return (
    <TaskGroupWrapper>
      <TaskGroup label="Note" value="note" variant="neutral">
        {visibleTasks.unschaduled.map((t: ITask) => (
          <DraftItem
            key={`${t.id}`}
            type="task"
            item={t}
            compact={setting.compactView}
          />
        ))}
      </TaskGroup>
    </TaskGroupWrapper>
  )
}
