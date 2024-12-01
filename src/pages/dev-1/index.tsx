import { Space_Grotesk } from "next/font/google"

import Main from "~components/main"
import { WidgetContainer } from "~components/widgets/widgets"
import { AppStateProvider } from "~contexts/app-context"

const S = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

export default function Page() {
  return (
    <div className={`h-screen ${S.className} overflow-hidden`}>
      <div className="h-screen">
        <div className="w-full h-full flex">
          <AppStateProvider>
            <Main dev={true} />
          </AppStateProvider>
          <div className="w-[288px] bg-[#272727]">
            <WidgetContainer />
          </div>
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
