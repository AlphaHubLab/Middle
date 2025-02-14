import { Space_Grotesk } from "next/font/google"

import Sidebar from "~components/sidebar/sidebar"
import TaskManager from "~components/task-manager/task-manager"
import FetchProvider from "~contexts/fetch-provider"

// const S = Space_Grotesk({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"]
// })

export default function Page() {
  return (
    <div
      className={`h-screen min-h-[600px] overflow-hidden ${/**S.className*/ "a"}`}>
      <div className="h-screen min-h-[600px]">
        <div className="w-full h-full flex">
          <FetchProvider isDev>
            <TaskManager isDev />
          </FetchProvider>
          <Sidebar isDev />
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
