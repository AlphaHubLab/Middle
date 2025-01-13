import { useEffect, useState } from "react"
import uuid4 from "uuid4"

import { sendToBackground } from "@plasmohq/messaging"

import { usePersist } from "~contexts/persist-context"
import type { ITask } from "~lib/types"

export default function Popup() {
  const [tab, setTab] = useState("")
  const { setTasks } = usePersist()

  const message = async () => {
    const resp = await sendToBackground({
      name: "test",
      body: {
        id: 123
      }
    })

    console.log(resp)
  }

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

  const addTask = () => {
    const task: ITask = {
      id: new uuid4(),
      nodes: [
        { type: "h", value: "" },
        { type: "a", value: tab }
      ],
      params: { dueDate: -1, tags: [], identities: [] },
      dateAdded: new Date().getTime(),
      dateDone: -1,
      done: false
    }

    setTasks((prev) => [...prev, task])
  }

  return (
    <div className="w-[360px] h-[600px] bg-red-100">
      <button onClick={() => message()}>test</button>
      {tab === "chrome://newtab/" ||
        (tab === "chrome://newtab" && <div>Nothing</div>)}
      <div>{tab}</div>
      <button onClick={addTask}>Add a quick task from this Website</button>
    </div>
  )
}
