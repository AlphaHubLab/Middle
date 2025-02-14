// import { Profiler } from "react"

import Sidebar from "~components/sidebar/sidebar"

import "../style.css"

import TaskManager from "~components/task-manager/task-manager"
import FetchProvider from "~contexts/fetch-provider"

export default function Page() {
  return <NewTab />
}

export const NewTab = () => {
  return (
    <div className={`h-screen overflow-hidden`}>
      <div className="h-screen">
        <div className="w-full h-full flex">
          <FetchProvider>
            <TaskManager />
          </FetchProvider>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

// function onRender(
//   id,
//   phase,
//   actualDuration,
//   baseDuration,
//   startTime,
//   commitTime
// ) {
//   console.log(id, "ad:", actualDuration, "bd:", baseDuration)
// }
