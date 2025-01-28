// import { Space_Grotesk } from "next/font/google"
import { Profiler, useState } from "react"

import Sidebar from "~components/sidebar/sidebar"

import "../style.css"

import Main from "~components/pages/main"
// import { WidgetContainer } from "~components/sidebar/sidebar"
import FetchProvider from "~contexts/fetch-provider"

// const SG = Space_Grotesk({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"]
// })

export default function Page() {
  return (
    <div className={`h-screen overflow-hidden`}>
      <div className="h-screen">
        <div className="w-full h-full flex">
          <FetchProvider>
            <Main />
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
