import { useEffect } from "react"

import ButtonFull from "~components/ui/svgs/buttons/full-w-buttons"
import { usePersist } from "~contexts/persist-context"
import { useRecurrence } from "~contexts/recurrence-context"
import type { ITaskCore } from "~lib/types"

export default function RemoveModal({
  item,
  onClose
}: {
  item: ITaskCore
  onClose: () => void
}) {
  const { recurrences, setRecurrences } = useRecurrence()
  const { tasks, history, setTasks } = usePersist()

  const recurrence = recurrences.find((r) => r.id === item.recurrenceId)

  if (!recurrence) onClose()

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
  }

  return (
    <>
      <p className="pt-2 pb-12 text-black/70 text-sm">{message}</p>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <ButtonFull variant="red" onClick={() => removeSingleTask()}>
          Just remove this one
        </ButtonFull>
        {multipleIdentities && multipleDates && (
          <>
            <ButtonFull variant="red" onClick={() => removeSimilarIdentities()}>
              Remove all similar tasks using this identity
            </ButtonFull>
            <ButtonFull variant="red" onClick={() => removeSimilarDates()}>
              Remove all similar tasks with this due date
            </ButtonFull>
          </>
        )}
        <ButtonFull variant="red" onClick={() => removeAllSimilar()}>
          Remove all similar tasks
        </ButtonFull>
      </div>
    </>
  )
}
