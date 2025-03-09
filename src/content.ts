import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:3000/auth*"]
}

export {}

window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data.action) return

  if (event.data.action === "refresh_fetch_cloud") {
    ;(async () => {
      await sendToBackground({
        name: "refresh",
        body: { extensionId: event.data.extensionId }
      })
    })()
  }
})
