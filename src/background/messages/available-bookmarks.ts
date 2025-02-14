import type { PlasmoMessaging } from "@plasmohq/messaging"

import { FETCH_API } from "~fetch.config"

const defaultBookmarks = {
  sponsered: [
    {
      icon: "+",
      name: "website",
      description: "Something awesome",
      url: "#"
    },
    {
      icon: "+",
      name: "website",
      description: "Something awesome",
      url: "#"
    },
    { icon: "+", name: "website", description: "Something awesome", url: "#" }
  ],
  hot: [
    {
      icon: "+",
      name: "website",
      description: "Something awesome with max 55 character description",
      url: "#"
    },
    { icon: "+", name: "website", description: "Something awesome", url: "#" }
  ]
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  //   const message = await querySomeApi(req.body.id)

  const response = await fetch(`${FETCH_API}/available-apps`)

  //   const json = await response.json()

  if (response.status === 201) {
    const bookmarks = await response.json()
    console.log(bookmarks)
    res.send(bookmarks)
  }

  if (response.status === 400) {
    res.send(defaultBookmarks)
  }
}

export default handler
