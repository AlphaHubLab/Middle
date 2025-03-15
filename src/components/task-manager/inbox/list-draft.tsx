import { useDraft } from "~providers/draft-context"
import { useSetting } from "~providers/setting-provider"

import { DraftItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

export default function DraftList() {
  const { drafts } = useDraft()
  const { setting } = useSetting()
  
  return (
    <TaskGroupWrapper>
      <TaskGroup label="Drafts" value="drafts" variant="neutral">
        {drafts.map((t) => (
          <DraftItem
            key={`${t.id}`}
            type="draft"
            item={t}
            compact={setting.compactView}
          />
        ))}
      </TaskGroup>
    </TaskGroupWrapper>
  )
}
