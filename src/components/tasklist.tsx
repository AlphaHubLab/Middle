import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

const mockTask = [
  ...(() =>
    Array.from({ length: 20 }).map((_) => ({
      task: [{ type: "h", value: "task" }]
    })))()
]

export default function TaskList({ show, setShow }) {
  const tasks = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local"
      })
    },
    (v: Array<any>) => (!v ? mockTask : v)
  )[0]

  return (
    <div
      dir="rtl"
      // className={`absolute w-full h-full px-4
      //   bg-white/80 transition-all duration-200
      //   ${show ? "top-[96px] " : "top-[calc(100%-96px)]"}
      // `}
      className={`absolute w-full h-full px-4 
        bg-white/80 transition-all duration-200
      `}>
      {!show && (
        <div
          onClick={() => setShow(true)}
          className="cursor-pointer w-full flex items-center justify-center">
          <Handle />
        </div>
      )}
      <div
        className={`styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-4`}>
        <div dir="ltr" className={`relative px-4 mb-4`}>
          {!show && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )}

          {tasks.map((t, i) => (
            <div className="py-1" key={`task-${i}`}>
              <TaskItem task={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TaskItem = ({ task }) => {
  return (
    <div
      style={{ borderRight: "5px solid blue" }}
      className="border-r hover:shadow-md cursor-pointer transition-all duration-200 h-10 flex items-center font-bold px-2 bg-[#f7f7f7] rounded-md">
      {task.task[0].value}
    </div>
  )
}

const Handle = () => {
  return (
    <svg
      className="h-6"
      width="800px"
      height="800px"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg">
      <title>drag-handle</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="invisible_box" data-name="invisible box">
          <rect width="48" height="48" fill="none" />
        </g>
        <g id="icons_Q2" data-name="icons Q2">
          <g>
            <path d="M46,20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z" />
            <path d="M46,28a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z" />
          </g>
        </g>
      </g>
    </svg>
  )
}
