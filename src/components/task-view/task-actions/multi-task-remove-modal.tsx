import { useEffect } from "react"
import { PiWarning } from "react-icons/pi"

import { Modal, type IModalProps } from "~components/ui/modal"
import { usePersist } from "~contexts/persist-context"
import { useReference } from "~contexts/reference-context"
import type { ITaskCore } from "~lib/types"

interface ITaskActionModalProps extends Omit<IModalProps, "children"> {
  item: ITaskCore
}

export default function RemoveModal({ item, ...props }: ITaskActionModalProps) {
  const { references, setReferences } = useReference()
  const { tasks, setTasks } = usePersist()

  const reference = references.find((r) => r.id === item.reference)

  // if (!reference) return props.onClose()

  const multipleIdentities = reference.params.identities.length > 1
  const multipleDates = reference.params.repeatParams

  const message =
    "Similar tasks are created with " +
    (multipleIdentities ? "multiple identities" : "") +
    (multipleIdentities && multipleDates ? " & " : "") +
    (multipleDates ? "multiple dates" : "") +
    ". What do you want to do?"

  // Remove unused reference
  useEffect(() => {
    if (
      tasks.filter((task) => task.reference === item.reference).length === 0
    ) {
      setReferences((prev) => prev.filter((r) => r.id !== item.reference))
    }
  }, [tasks])

  const removeSingleTask = () => {
    setTasks((prev) => prev.filter((task) => task.id !== item.id))
  }

  const removeSimilarIdentities = () => {
    setTasks((prev) =>
      prev.filter(
        (task) =>
          task.reference !== item.reference ||
          task.params.identities[0].id !== item.params.identities[0].id
      )
    )

    // Remove deleted identity from reference
    const { params } = reference

    params.identities = params.identities.filter(
      (identity) => identity.id !== item.params.identities[0].id
    )

    setReferences((prev) => {
      const _prev = [...prev]
      const found = prev.find((r) => r.id === item.reference)

      if (found) found.params = params

      return _prev
    })
  }

  const removeSimilarDates = () => {
    setTasks((prev) =>
      prev.filter(
        (task) =>
          task.reference !== item.reference ||
          task.params.dueDate !== item.params.dueDate
      )
    )

    // Todo: Remove Similar dates on referencees?
  }

  const removeAllSimilar = () => {
    setTasks((prev) => prev.filter((task) => task.reference !== item.reference))
  }

  return (
    <Modal
      {...props}
      title={
        <h1 className="flex items-center gap-2 w-full">
          <PiWarning /> <span className="text-rose-500">Delete Items</span>
        </h1>
      }>
      <p className="pt-2 pb-12 text-zinc-600 text-sm">{message}</p>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={removeSingleTask}>
          Just remove this one
        </button>
        {multipleIdentities && multipleDates && (
          <>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={removeSimilarIdentities}>
              Remove all similar tasks using this identity
            </button>
            <button
              className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
              onClick={removeSimilarDates}>
              Remove all similar tasks with this due date
            </button>
          </>
        )}
        <button
          className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={removeAllSimilar}>
          Remove all similar tasks
        </button>
      </div>
    </Modal>
  )
}
