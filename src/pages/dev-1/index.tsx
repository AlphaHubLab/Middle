import { Space_Grotesk } from "next/font/google"
import { Profiler, useState } from "react"

// import Apps from "~components/apps/apps"
import TodoMainSlash from "~components/editor/todo-main"
import NavbarContainer from "~components/navbar/navbar-container"
import WidgetGrid, { Wid } from "~components/widgets/widgets"

const SG = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

export default function Page() {
  const [disabled, setDisabled] = useState(true)
  return (
    <div className={`h-screen ${SG.className} overflow-hidden`}>
      <NavbarContainer />
      <div className="h-[calc(100%-96px)]">
        <div className="w-full h-full flex">
          <div className="relative h-full w-[calc(100%-288px)]">
            {/* <Profiler id="todo" onRender={onRender}> */}

            <div
              onClick={() => setDisabled(false)}
              className={` w-full max-w-[650px] mx-auto p-4 transition-all ${disabled ? "hover:cursor-text opacity-50 scale-90" : "opacity-100 scale-100"}`}>
              <TodoMainSlash disabled={disabled} />
            </div>
            <div className="flex w-full justify-center">
              <div
                className={`absolute ${disabled ? "z-50" : "-z-10"} max-w-[650px] mx-auto top-[130px] h-[calc(100%-230px)] overflow-y-hidden w-full z-100`}>
                <TaskList show={disabled} />
                <div className="gradientback"></div>
              </div>
            </div>
          </div>
          {/* </Profiler> */}
          <div className="w-[288px]">
            <WidgetGrid col={4} row={10} offset={8}>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={4} h={1}>
                1
              </Wid>
              <Wid w={2} h={2}>
                1
              </Wid>
              <Wid w={2} h={2}>
                1
              </Wid>
              <Wid w={2} h={2} shape="circle">
                1
              </Wid>
              <Wid w={2} h={1}>
                1
              </Wid>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={1} h={1}>
                1
              </Wid>
              <Wid w={4} h={2}>
                1
              </Wid>
              <button className="z-200" onClick={() => setDisabled(true)}>
                show
              </button>
            </WidgetGrid>
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

const TaskList = ({ show }) => {
  console.log(show)
  return (
    <div
      className={`bg-white/20 px-2 absolute transition-all w-full h-full duration-200 ${show ? "top-0 " : "top-[80%]"}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div className="z-30 py-1" key={`task-${i}`}>
          <div className="bg-white border rounded-md">s</div>
        </div>
      ))}
    </div>
  )
}
