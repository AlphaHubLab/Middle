import { useApp } from "providers/app-context"
import { usePersist } from "providers/persist-context"
import { useRecurrence } from "providers/recurrence-context"
import { useEffect } from "react"
import uuid4 from "uuid4"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import type { ITaskCore } from "~lib/types"

export default function EditModal({
  item,
  onClose
}: {
  item: ITaskCore
  onClose: () => void
}) {
  const { recurrences, setRecurrences } = useRecurrence()
  const { tasks } = usePersist()
  const { setRecurrenceEditData, openEditMode } = useApp()

  const recurrence = recurrences.find((r) => r.id === item.recurrenceId)

  const multipleIdentities = recurrence.params.identities.length > 1
  const multipleDates = recurrence.params.repeatParams

  const message =
    "Similar tasks are created with " +
    (multipleIdentities ? "multiple identities" : "") +
    (multipleIdentities && multipleDates ? " & " : "") +
    (multipleDates ? "multiple dates" : "") +
    ". What do you want to do?"

  // Remove unused recurrence obj
  useEffect(() => {
    if (
      tasks.filter((task) => task.recurrenceId === item.recurrenceId).length ===
      0
    ) {
      setRecurrences((prev) => prev.filter((r) => r.id !== item.recurrenceId))
    }
  }, [tasks])

  const editSimilarIdentities = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
      taskId: item.id,
      type: "identity",
      date: -1,
      identityId: item.params.identities[0].id
    })

    const recurrence = recurrences.find((r) => r.id === item.recurrenceId)

    const newParams = {
      ...recurrence.params,
      identities: [item.params.identities[0]]
    }

    const taskCore = {
      id: uuid4(),
      nodes: recurrence.nodes,
      recurrenceId: "",
      params: newParams
    }

    openEditMode(taskCore, "recurrence")
    onClose()
  }

  const editSimilarDates = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
      taskId: item.id,
      type: "date",
      date: item.params.dueDate,
      identityId: -1
    })

    const recurrence = recurrences.find((r) => r.id === item.recurrenceId)

    const newParams = {
      ...recurrence.params,
      repeatParams: null,
      dueDate: item.params.dueDate,
      identities: recurrence.params.identities
    }

    const taskCore = {
      id: uuid4(),
      nodes: recurrence.nodes,
      recurrenceId: "",
      params: newParams
    }

    openEditMode(taskCore, "recurrence")
    onClose()
  }

  const editSingleTask = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
      taskId: item.id,
      type: "single",
      date: -1,
      identityId: -1
    })

    const newParams = {
      ...recurrence.params,
      repeatParams: null,
      dueDate: item.params.dueDate,
      identities: recurrence.params.identities
    }

    const taskCore = {
      id: uuid4(),
      nodes: recurrence.nodes,
      recurrenceId: "",
      params: newParams
    }

    openEditMode(taskCore, "recurrence")
    onClose()
  }

  const editAllSimilar = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
      taskId: item.id,
      type: "all",
      date: -1,
      identityId: -1
    })

    const taskCore = {
      id: uuid4(),
      nodes: recurrence.nodes,
      recurrenceId: "",
      params: recurrence.params
    }

    openEditMode(taskCore, "recurrence")
    onClose()
  }

  return (
    <>
      <p className="pt-2 pb-12 text-black/70 text-sm">{message}</p>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <ButtonFull variant="blue" onClick={editSingleTask}>
          Just edit this one
        </ButtonFull>
        {multipleIdentities && multipleDates && (
          <>
            <ButtonFull variant="blue" onClick={editSimilarIdentities}>
              Edit all similar tasks using this identity
            </ButtonFull>
            <ButtonFull variant="blue" onClick={editSimilarDates}>
              Edit all similar tasks with this due date
            </ButtonFull>
          </>
        )}
        <ButtonFull variant="blue" onClick={editAllSimilar}>
          Edit all similar tasks
        </ButtonFull>
      </div>
    </>
  )
}
