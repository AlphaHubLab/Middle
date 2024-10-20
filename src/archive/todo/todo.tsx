import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export default function Todo({ data }) {
  // useStorage is plasmo hook (see: https://docs.plasmo.com/framework/storage)
  const [tasks, setTask] = useStorage(
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

  const handleTask = () => {
    const _tasks = [...tasks]
    const task = _tasks.find((t) => t.id === data.id)
    task.done = !task.done
    setTask(_tasks)
  }

  return (
    <div className="border border-1 p-2 my-2 rounded-xl">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="first-token-id"
          className="w-4 h-4 accent-tock-green text-blue-100"
          onChange={handleTask}
          checked={data.done === true}
        />
      </div>
      {data.task}
    </div>
  )
}
