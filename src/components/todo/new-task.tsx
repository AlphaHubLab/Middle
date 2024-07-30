import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

/**
 * A JSX componet for adding new task
 * For now just an empty text box, more functionally like title, date &... can be added later.
 * @param param0
 * @returns
 */
export default function NewTask({ onSave }) {
  const [task, setTask] = useState("")

  // useStorage is plasmo hook (see: https://docs.plasmo.com/framework/storage)
  const [tasks, setTasks] = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local" // use "sync" for production to sync with logged in email.
      })
    },
    // A funtion to get storage by provided key ("middle-tasks") if exists.
    // if not exists (first use), initilize the empty array for storing tasks.
    (v: Array<any>) => (!v ? [] : v)
  )
  const onSubmit = () => {
    const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 0
    const newTask = { id, task, done: false, date: new Date() }
    setTasks([...tasks, newTask])
    onSave()
  }

  return (
    <div className="border border-1 p-2 my-2">
      <textarea
        value={task}
        name="task"
        className="text-sm appearance-none min-h-28 bg-white rounded-xl w-full py-3 px-3 focus:outline-none leading-tight border-none"
        placeholder="My very productive task..."
        onChange={(e) => setTask(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          className="p-1 border rounded-lg hover:bg-gray-200"
          onClick={onSubmit}>
          Save
        </button>
      </div>
    </div>
  )
}
