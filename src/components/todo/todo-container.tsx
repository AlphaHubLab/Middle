import { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import NewTask from "./new-task"
import Todo from "./todo"

export default function TodoList() {
  const [newTask, showNewTaks] = useState(false)

  // useStorage is plasmo hook (see: https://docs.plasmo.com/framework/storage)
  const [tasks, _, { remove }] = useStorage(
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

  return (
    <>
      <div className="my-2">
        <p className="text-xs text-rose-500">for dev purposes</p>
        <button
          className="text-rose-500 border border-rose-500 rounded-lg p-1 hover:bg-gray-200 border-"
          onClick={() => remove()}>
          reset storage
        </button>
      </div>

      <div>
        <h1 className="font-bold text-xl border-b border-1 pb-1 mb-2">Tasks</h1>
        <div className="flex justify-end">
          <button
            className="border border-1 p-1 hover:bg-gray-200 rounded-xl"
            onClick={() => showNewTaks(true)}>
            + new task
          </button>
        </div>
        {newTask && <NewTask onSave={() => showNewTaks(false)} />}
        {tasks && tasks.length === 0 && (
          <div className="w-full h-full items-center">
            <p className="text-center my-2">Good news! no tasks to do!</p>
          </div>
        )}
        {tasks &&
          tasks.map((t, i) => (
            <div key={`task-${i}`}>
              <Todo data={t}></Todo>
            </div>
          ))}
      </div>
    </>
  )
}
