import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import FetchLogo from "~components/ui/fetch-logo"
import { getTaskDefaultParams } from "~lib/task-helpers"
import type { ITask } from "~lib/types"
import { usePersist } from "~providers/persist-provider"

export default function PopupComponent() {
  const [tab, setTab] = useState<{ url: string; title: string }>({
    url: "",
    title: ""
  })

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

          if (tab.url) setTab({ url: tab.url, title: tab.title })
        }
      ),
    [chrome]
  )

  const addTask = (type: "task" | "note") => {
    const now = new Date().getTime()
    const task: ITask = {
      id: uuidv4(),
      nodes: [
        { type: "h", value: tab.title },
        { type: "a", value: tab.url }
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
        {tab.url === "chrome://newtab/" || tab.url === "chrome://newtab" ? (
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
            <input className="w-full border px-2 rounded-xl h-8" value={tab.title} />
            <textarea className="w-full border px-2 rounded-xl" value="" />
            <p className="break-all p-2 text-blue-500 border border-fetch-primary rounded-2xl my-4">
              {tab.url}
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
      </div>
    </div>
  )
}
