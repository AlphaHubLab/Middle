import { useDraft } from "~contexts/draft-context"

import { DraftItem } from "../items"
import { TaskGroup, TaskGroupWrapper } from "../task-group"

export default function DraftList() {
  const { drafts } = useDraft()

  return (
    <TaskGroupWrapper>
      <TaskGroup label="Drafts" value="drafts" variant="neutral">
        {drafts.map((t) => (
          <DraftItem key={`${t.id}`} type="draft" item={t} />
        ))}
      </TaskGroup>
    </TaskGroupWrapper>
  )
}
