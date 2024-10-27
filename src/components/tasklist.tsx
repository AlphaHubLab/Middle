import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export default function TaskList({ show }) {
  const tasks = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local"
      })
    },
    (v: Array<any>) => (!v ? [] : v)
  )[0]

  return (
    <div
      className={`bg-white/20 px-2 absolute transition-all w-full h-full duration-200 ${show ? "top-0 " : "top-[calc(100%-100px)]"}`}>
      {tasks.map((t, i) => (
        <div className="z-30 py-1" key={`task-${i}`}>
          <div className="h-10 flex items-center font-bold px-2 bg-zinc-100 bg-white rounded-md">{t.task[0].value}</div>
        </div>
      ))}
    </div>
  )
}
