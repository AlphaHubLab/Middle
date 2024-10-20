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
  return (
    <div className="h-screen">
      <NavbarContainer />
      <div
        className={`h-[calc(100%-96px)] pt-24 w-screen flex ${SG.className}`}>
        <div className="flex w-[calc(100%-288px)] justify-center">
          {/* <Profiler id="todo" onRender={onRender}> */}
          <div className="w-full max-w-[650px] mx-auto p-4">
            <TodoMainSlash />
          </div>
          {/* </Profiler> */}
        </div>
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
          </WidgetGrid>
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
