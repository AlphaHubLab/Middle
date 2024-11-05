import { Space_Grotesk } from "next/font/google"
import { Profiler, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

// import Apps from "~components/apps/apps"
import TodoMainSlash from "~components/editor/todo-main"
import NavbarContainer from "~components/navbar/navbar-container"
import TaskList from "~components/tasklist"
import { WidgetContainer } from "~components/widgets/widgets"

const S = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

export default function Page() {
  const setTasks = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local"
      })
    },
    (v: Array<any>) => (!v ? [] : v)
  )[1]

  const [disabled, setDisabled] = useState(true)
  return (
    <div className={`h-screen ${S.className} overflow-hidden`}>
      <div className="h-screen">
        <div className="w-full h-full flex">
          {/* <Profiler id="todo" onRender={onRender}> */}
          <div className="relative h-full w-[calc(100%-288px)]">
            <NavbarContainer />
            <div className="">
              <div
                // style={{ scale: disabled ? "95%" : "100%" }}
                className={`relative w-full max-w-[650px] mx-auto p-4
                `}>
                {disabled && (
                  <div
                    onClick={() => setDisabled(false)}
                    className="hover:cursor-text absolute w-full h-full left-0 top-0 bg-white/50"></div>
                )}
                <TodoMainSlash disabled={disabled} setStorage={setTasks} />
              </div>
            </div>
            <div className="flex w-full justify-center">
              <div
                className={`absolute overflow-y-hidden max-w-[650px] mx-auto top-[230px] h-[calc(100%-330px)] w-full`}>
                <TaskList show={disabled} setShow={setDisabled} />
                <div className="gradientback"></div>
              </div>
            </div>
          </div>
          {/* </Profiler> */}
          <div className="w-[288px] bg-[#272727]">
            <WidgetContainer />
          </div>
        </div>
      </div>
    </div>
  )
}
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(id, "ad:", actualDuration, "bd:", baseDuration)
}
