import { lazy, Suspense, useState } from "react"
import {
  PiArrowCounterClockwise,
  PiPencilSimpleLine,
  PiTrash
} from "react-icons/pi"

import { useApp } from "~contexts/app-context"
import { usePersist } from "~contexts/persist-context"
import type { ITaskCore } from "~lib/types"

const LazyRemoveModal = lazy(() => import("./multi-task-remove-modal"))

export const TaskToolbar = ({
  type,
  item
}: {
  item: ITaskCore
  type: "task" | "draft" | "history"
}) => {
  const { openEditMode } = useApp()
  const { setTasks } = usePersist()

  const [showRemoveModal, setShowRemoveModal] = useState(false)

  const removeTasks = (item: ITaskCore) => {
    if (item.reference.length === 0) {
      setTasks((prev) => prev.filter((task) => task.id !== item.id))
    } else {
      setShowRemoveModal(true)
    }
  }

  // const editTask = (item: ITaskCore) => {
  //   if (item.reference.length > 0) {
  //   }
  // }

  return (
    <>
      {/* History items cannot be edited */}
      {type !== "history" && (
        <button
          className="text-zinc-500 hover:text-zinc-400 text-xs items-center px-2 flex gap-2"
          onClick={() => openEditMode(item, type)}>
          <PiPencilSimpleLine />
          Edit
        </button>
      )}
      {/* Only tasks items can be deleted using toolbar */}
      {/* Draft items have its own delete button*/}
      {type === "task" && (
        <button
          className="text-rose-500 text-xs hover:text-rose-400 px-2 flex gap-2 items-center"
          onClick={() => removeTasks(item)}>
          <PiTrash />
          Delete
        </button>
      )}
      {/* Only history items can be recycled */}
      {type === "history" && (
        <button
          className="text-zinc-500 text-xs hover:text-zinc-400 px-2 flex gap-2 items-center"
          onClick={() => openEditMode(item, "new")}>
          <PiArrowCounterClockwise />
          Recycle
        </button>
      )}
      {showRemoveModal && (
        <Suspense>
          <LazyRemoveModal
            title="Delete"
            className="w-full max-w-[600px] rounded-2xl bg-white"
            item={item}
            onClose={() => setShowRemoveModal(false)}
            show={showRemoveModal}
          />
        </Suspense>
      )}
    </>
  )
}
