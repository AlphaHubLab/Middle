// import { useEffect } from "react"

// import { Modal, type IModalProps } from "~components/ui/modal"
// import { usePersist } from "~contexts/persist-context"
// import { useReference } from "~contexts/reference-context"
// import type { ITaskCore } from "~lib/types"

// interface ITaskActionModalProps extends Omit<IModalProps, "children"> {
//   item: ITaskCore
// }

// export default function EditModal({ item, ...props }: ITaskActionModalProps) {
//   const { references, setReferences } = useReference()
//   const { tasks, setTasks } = usePersist()

//   const reference = references.find((r) => r.id === item.reference)

//   const multipleIdentities = reference.params.identities.length > 1
//   const multipleDates = reference.params.repeatParams

//   const message =
//     "Similar tasks are created with " +
//     (multipleIdentities ? "multiple identities" : "") +
//     (multipleIdentities && multipleDates ? " & " : "") +
//     (multipleDates ? "multiple dates" : "") +
//     ". What do you want to do?"

//   // Remove unused reference
//   useEffect(() => {
//     if (
//       tasks.filter((task) => task.reference === item.reference).length === 0
//     ) {
//       setReferences((prev) => prev.filter((r) => r.id !== item.reference))
//     }
//   }, [tasks])

//   const removeSingleTask = () => {
//     setTasks((prev) => prev.filter((task) => task.id !== item.id))
//   }

//   // TODO: edit selected
//   // TODO: edit all
  
//   const editSingleTask = () => {}

//   const editSimilarIdentities = () => {}

//   const editSmilarDates = () => {}

//   // const removeSimilarIdentities = () => {
//   //   setTasks((prev) =>
//   //     prev.filter(
//   //       (task) =>
//   //         task.reference !== item.reference ||
//   //         task.params.identities[0].id !== item.params.identities[0].id
//   //     )
//   //   )

//   //   // Remove deleted identity from reference
//   //   const { params } = reference

//   //   params.identities = params.identities.filter(
//   //     (identity) => identity.id !== item.params.identities[0].id
//   //   )

//   //   setReferences((prev) => {
//   //     const _prev = [...prev]
//   //     const found = prev.find((r) => r.id === item.reference)

//   //     found.params = params

//   //     return _prev
//   //   })
//   // }

//   // const removeSimilarDates = () => {
//   //   setTasks((prev) =>
//   //     prev.filter(
//   //       (task) =>
//   //         task.reference !== item.reference ||
//   //         task.params.dueDate !== item.params.dueDate
//   //     )
//   //   )

//   //   // Todo: Remove Similar dates?
//   // }

//   // const removeAllSimilar = () => {
//   //   setTasks((prev) => prev.filter((task) => task.reference !== item.reference))
//   // }

//   return (
//     <Modal {...props}>
//       <p className="pt-2 pb-12 text-fetch-primary text-sm font-bold">
//         {message}
//       </p>
//       <div className="py-2 text-sm flex flex-col items-center *:my-1">
//         <button
//           className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
//           onClick={removeSingleTask}>
//           Just edit this one
//         </button>
//         {multipleIdentities && multipleDates && (
//           <>
//             <button
//               className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
//               onClick={removeSimilarIdentities}>
//               Edit all similar tasks using this identity
//             </button>
//             <button
//               className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
//               onClick={removeSimilarDates}>
//               Edit all similar tasks with this due date
//             </button>
//           </>
//         )}
//         <button
//           className="block text-rose-500 hover:text-rose-400 py-1 w-full border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
//           onClick={removeAllSimilar}>
//           Edit all
//         </button>
//       </div>
//     </Modal>
//   )
// }
