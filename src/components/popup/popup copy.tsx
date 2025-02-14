import { useEffect, useState } from "react"
import uuid4 from "uuid4"

import FetchLogo from "~components/ui/fetch-logo"
import { usePersist } from "~contexts/persist-context"
// import { sendToBackground } from "@plasmohq/messaging"
import { getTaskDefaultParams } from "~lib/task-helpers"
import type { ITask } from "~lib/types"

export default function Popup() {
  const [tab, setTab] = useState("")

  const { setTasks } = usePersist()

  // const message = async () => {
  //   const resp = await sendToBackground({
  //     name: "test",
  //     body: {
  //       id: 123
  //     }
  //   })

  //   console.log(resp)
  // }

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
      reference: "",
      params: getTaskDefaultParams(),
      dateAdded: now,
      dateDone: -1,
      done: false
    }

    if (type === "task") task.params.dueDate = now + 24 * 60 * 60 * 1000

    setTasks((prev) => [...prev, task])
  }

  return (
    <div className="w-[360px] h-[600px] bg-red-100">
      <nav className="relative w-full h-16 py-2 px-1 flex items-center justify-center">
        <div className="rounded-2xl w-full h-full bg-indigo-50 border border-fetch-primary flex p-2">
          <div className="w-full h-full flex gap-2 flex items-center">
            <FetchLogo />
          </div>
        </div>
      </nav>
      {tab === "chrome://newtab/" ||
        (tab === "chrome://newtab" ? (
          <div>Nothing To add</div>
        ) : (
          <>
            <p>{tab}</p>
            <button
              className="py-1 px-2 w-full block hover:bg-fetch-secondary border-fetch-primary text-sm text-fetch-primary"
              onClick={() => addTask("task")}>
              Save as a task
            </button>
            <button
              className="py-1 px-2 w-full block hover:bg-fetch-secondary border-fetch-primary text-sm text-fetch-primary"
              onClick={() => addTask("note")}>
              Save as a note
            </button>
          </>
        ))}

      {/* <button onClick={() => message()}>test</button> */}
    </div>
  )
}
