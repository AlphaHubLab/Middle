import { lazy, Suspense, useState } from "react"
import {
  PiArrowCounterClockwise,
  PiPencilSimpleLine,
  PiTrash
} from "react-icons/pi"

import { useApp } from "~contexts/app-context"
import { usePersist } from "~contexts/persist-context"
import type { ITaskCore } from "~lib/types"

const LazyRemoveModal = lazy(() => import("../items/multi-task-remove-modal"))
const LazyEditModal = lazy(() => import("../items/multi-task-edit-modal"))

export const TaskToolbar = ({
  type,
  item,
  slideToDelete = null
}: {
  item: ITaskCore
  type: "task" | "draft" | "history"
  slideToDelete?: () => void
}) => {
  const { openEditMode } = useApp()

  const [showWarning, setShowWarning] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const removeTask = (item: ITaskCore) => {
    if (item.recurrenceId.length === 0) setShowWarning(true)
    else setShowRemoveModal(true)
  }

  const editTask = (item: ITaskCore, type) => {
    if (item.recurrenceId.length > 0) {
      setShowEditModal(true)
    } else {
      openEditMode(item, type)
    }
  }

  return (
    <>
      {/* History items cannot be edited */}
      {type !== "history" && (
        <button
          tabIndex={-1}
          className="text-zinc-500 hover:text-zinc-400 text-xs items-center px-2 flex gap-2"
          onClick={() => editTask(item, type)}>
          <PiPencilSimpleLine />
          Edit
        </button>
      )}
      {/* Only tasks items can be deleted using toolbar */}
      {/* Draft items have its own delete button*/}

      {type === "task" && slideToDelete && (
        <>
          {!showWarning && (
            <button
              tabIndex={-1}
              className="text-rose-500 text-xs hover:text-rose-400 px-2 flex gap-2 items-center"
              onClick={() => removeTask(item)}>
              <PiTrash />
              Delete
            </button>
          )}
          {showWarning && (
            <div className="text-xs flex font-medium items-center justify-start gap-4 px-2 h-full w-full text-rose-400 border-r-[1px] overflow-x-hidden">
              <button
                className="w-16 hover:text-blue-500/70 text-center text-blue-500"
                onClick={() => setShowWarning(false)}>
                Keep
              </button>
              <button
                onClick={slideToDelete}
                className="w-16 hover:text-rose-500/70 text-center text-rose-500">
                Delete
              </button>
            </div>
          )}
        </>
      )}
      {/* Only history items can be recycled */}
      {type === "history" && (
        <button
          tabIndex={-1}
          className="text-zinc-500 text-xs hover:text-zinc-400 px-2 flex gap-2 items-center"
          onClick={() => openEditMode(item, "new")}>
          <PiArrowCounterClockwise />
          Recycle
        </button>
      )}
      {showRemoveModal && (
        <Suspense>
          <LazyRemoveModal
            item={item}
            onClose={() => setShowRemoveModal(false)}
            show={showRemoveModal}
          />
        </Suspense>
      )}
      {showEditModal && (
        <Suspense>
          <LazyEditModal
            item={item}
            onClose={() => setShowEditModal(false)}
            show={showEditModal}
          />
        </Suspense>
      )}
    </>
  )
}
