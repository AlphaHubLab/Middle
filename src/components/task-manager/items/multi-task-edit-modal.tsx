import { useEffect } from "react"
import { PiWarning } from "react-icons/pi"
import uuid4 from "uuid4"

import { Modal, type IModalProps } from "~components/ui/modal"
import { useApp } from "~contexts/app-context"
import { usePersist } from "~contexts/persist-context"
import { useRecurrence } from "~contexts/recurrence-context"
import type { ITaskCore } from "~lib/types"

interface ITaskActionModalProps extends Omit<IModalProps, "children"> {
  item: ITaskCore
}

export default function EditModal({ item, ...props }: ITaskActionModalProps) {
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

  // Remove unused recurrence
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
    props.onClose()
  }

  const editSimilarDates = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
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
    props.onClose()
  }

  const editSingleTask = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
      type: "single",
      date: item.params.dueDate,
      identityId: item.params.identities[0].id
    })

    const newParams = {
      ...recurrence.params,
      repeatParams: null,
      dueDate: item.params.dueDate,
      identities: [recurrence.params.identities[0]]
    }

    const taskCore = {
      id: uuid4(),
      nodes: recurrence.nodes,
      recurrenceId: "",
      params: newParams
    }

    openEditMode(taskCore, "recurrence")
    props.onClose()
  }

  const editAllSimilar = () => {
    setRecurrenceEditData({
      id: item.recurrenceId,
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
    props.onClose()
  }

  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex items-center gap-2 w-full">
          <PiWarning /> <span className="text-blue-500">Edit Items</span>
        </h1>
      }>
      <p className="pt-2 pb-12 text-black/70 text-sm">{message}</p>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={editSingleTask}>
          Just edit this one
        </button>
        {multipleIdentities && multipleDates && (
          <>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={editSimilarIdentities}>
              Edit all similar tasks using this identity
            </button>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={editSimilarDates}>
              Edit all similar tasks with this due date
            </button>
          </>
        )}
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={editAllSimilar}>
          Edit all similar tasks
        </button>
      </div>
    </Modal>
  )
}
