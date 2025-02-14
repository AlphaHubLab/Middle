import { useEffect, useState } from "react"
import { PiWarning } from "react-icons/pi"

import { Modal, type IModalProps } from "~components/ui/modal"
import { usePersist } from "~contexts/persist-context"
import { useRecurrence } from "~contexts/recurrence-context"
import type { ITaskCore } from "~lib/types"

interface ITaskActionModalProps extends Omit<IModalProps, "children"> {
  item: ITaskCore
}

export default function RemoveModal({ item, ...props }: ITaskActionModalProps) {
  const { recurrences, setRecurrences } = useRecurrence()
  const { tasks, history, setTasks } = usePersist()

  const recurrence = recurrences.find((r) => r.id === item.recurrenceId)

  if (!recurrence) props.onClose()

  const multipleIdentities = recurrence?.params.identities.length > 1
  const multipleDates = recurrence?.params.repeatParams

  const message =
    "Similar tasks are created with " +
    (multipleIdentities ? "multiple identities" : "") +
    (multipleIdentities && multipleDates ? " & " : "") +
    (multipleDates ? "multiple dates" : "") +
    ". What do you want to do?"

  // Remove unused recurrence
  useEffect(() => {
    if (tasks.length === 0) return
    if (
      tasks.filter((task) => task.recurrenceId === item.recurrenceId).length ===
        0 &&
      history.filter((history) => history.recurrenceId === item.recurrenceId)
        .length === 0
    ) {
      setRecurrences((prev) => prev.filter((r) => r.id !== item.recurrenceId))
    }
  }, [tasks])

  const removeSingleTask = async () => {
    await setTasks((prev) => prev.filter((task) => task.id !== item.id))
  }

  const removeSimilarIdentities = async () => {
    await setTasks((prev) =>
      prev.filter(
        (task) =>
          task.recurrenceId !== item.recurrenceId ||
          task.params.identities[0].id !== item.params.identities[0].id
      )
    )

    // Remove deleted identity from recurrence
    const { params } = recurrence

    params.identities = params.identities.filter(
      (identity) => identity.id !== item.params.identities[0].id
    )

    await setRecurrences((prev) => {
      const _prev = [...prev]
      const found = prev.find((r) => r.id === item.recurrenceId)

      if (found) found.params = params

      return _prev
    })
  }

  const removeSimilarDates = async () => {
    await setTasks((prev) =>
      prev.filter(
        (task) =>
          task.recurrenceId !== item.recurrenceId ||
          task.params.dueDate !== item.params.dueDate
      )
    )
    // Todo: Remove Similar dates on recurrences?
  }

  const removeAllSimilar = async () => {
    await setTasks((prev) =>
      prev.filter((task) => task.recurrenceId !== item.recurrenceId)
    )
    // props.onClose()
  }

  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex items-center gap-2 w-full">
          <PiWarning /> <span className="text-rose-500">Delete Items</span>
        </h1>
      }>
      <p className="pt-2 pb-12 text-black/70 text-sm">{message}</p>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={() => removeSingleTask()}>
          Just remove this one
        </button>
        {multipleIdentities && multipleDates && (
          <>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={() => removeSimilarIdentities()}>
              Remove all similar tasks using this identity
            </button>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={() => removeSimilarDates()}>
              Remove all similar tasks with this due date
            </button>
          </>
        )}
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={() => removeAllSimilar()}>
          Remove all similar tasks
        </button>
      </div>
    </Modal>
  )
}
