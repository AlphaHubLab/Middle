import { PiPencilSimpleLine } from "react-icons/pi"

import { useApp } from "~contexts/app-context"
import { useDraft } from "~contexts/draft-context"
import type { ITaskCore } from "~lib/types"

export const TaskToolbar = ({
  type,
  item
}: {
  item: ITaskCore
  type: "task" | "draft"
}) => {
  const { openEditMode } = useApp()
  const { setDrafts } = useDraft()

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
  }

  return (
    <>
      <button
        className="hover:text-zinc-500 text-sm px-2 flex gap-2"
        onClick={() => openEditMode(item, type)}>
        <PiPencilSimpleLine />
        Edit
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
