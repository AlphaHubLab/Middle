import type { PlasmoMessaging } from "@plasmohq/messaging"

const fetchApiUrl =
  process.env.PLASMO_PUBLIC_FETCH_API || "http://localhost:3000/api"

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
  const response = await fetch(`${fetchApiUrl}/available-apps`)

  if (response.status === 201) {
    const bookmarks = await response.json()
    res.send(bookmarks)
  }

  if (response.status === 400) {
    res.send(defaultBookmarks)
  }
}

export default handler
