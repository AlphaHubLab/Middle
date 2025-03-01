import { useEffect, useState } from "react"
import uuid4 from "uuid4"

import FetchLogo from "~components/ui/fetch-logo"
import { usePersist } from "providers/persist-context"
import { getTaskDefaultParams } from "~lib/task-helpers"
import type { ITask } from "~lib/types"

export default function PopupComponent() {
  const [tab, setTab] = useState("")

  const { setTasks } = usePersist()

  useEffect(
    () =>
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          const tab = tabs[0]
          if (tab.url) setTab(tab.url)
        }
      ),
    [chrome]
  )

  const addTask = (type: "task" | "note") => {
    const now = new Date().getTime()
    const task: ITask = {
      id: uuid4(),
      nodes: [
        { type: "h", value: "" },
        { type: "a", value: tab }
      ],
      recurrenceId: "",
      params: getTaskDefaultParams(),
      dateAdded: now,
      dateDone: -1,
      done: false
    }

    if (type === "task") task.params.dueDate = now + 24 * 60 * 60 * 1000

    setTasks((prev) => [...prev, task])

    window?.close()
  }

  return (
    <div className="w-[360px] h-fit">
      <nav className="relative w-full h-12 flex items-center justify-center bg-indigo-50 border-b border-fetch-primary flex p-1">
        <div className="w-full h-full flex gap-2 flex items-center">
          <FetchLogo />
        </div>
      </nav>
      <div className="h-[calc(100%-64px)] w-full flex items-center justify-center p-2">
        {tab === "chrome://newtab/" || tab === "chrome://newtab" ? (
          <div>
            <p className="text-fetch-primary py-4 w-full flex justify-center h-full items-center">
              Nothing To fetch...
            </p>
            <p className="text-zinc-500 text-xs">
              Open pop-up on a website to see how it works.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center">
            <p className="break-all p-2 text-blue-500 border border-fetch-primary rounded-2xl my-4">
              {tab}
            </p>
            <button
              className="py-1 h-10 px-2 w-full block hover:bg-violet-700 text-white bg-fetch-primary my-1 rounded-xl text-sm text-fetch-primary"
              onClick={() => addTask("task")}>
              Save as a task
            </button>
            <button
              className="py-1 px-2 h-10 w-full block hover:bg-violet-50 text-fetch-primary bg-white border border-fetch-primary my-1 rounded-xl text-sm text-fetch-primary"
              onClick={() => addTask("note")}>
              Save as a note
            </button>
          </div>
        )}

        {/* <button onClick={() => message()}>test</button> */}
      </div>
    </div>
  )
}
