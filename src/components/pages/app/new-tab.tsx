// import { Profiler } from "react"

import Sidebar from "~components/sidebar/sidebar"
import TaskManager from "~components/task-manager/task-manager"
import FetchProvider from "~providers/fetch-provider"
import Web3Provider from "~providers/web3-context"

export default function NewTab({ isDev = false }) {
  return (
    <Web3Provider>
      <FetchProvider isDev={isDev}>
        <div className={`h-screen overflow-hidden`}>
          <TaskManager isDev={isDev} />
          <Sidebar isDev={isDev} />
        </div>
      </FetchProvider>
    </Web3Provider>
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
