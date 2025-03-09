import type { PlasmoMessaging } from "@plasmohq/messaging"

// import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // const storage = new Storage()

  chrome.tabs.query(
    { url: `chrome-extension://${chrome.runtime.id}/tabs/cloud.html` },
    (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id)
        chrome.tabs.update(tabs[0].id, { active: true })
      } else {
        chrome.tabs.create({ url: `/tabs/cloud.html` })
      }
    }
  )
}

export default handler
