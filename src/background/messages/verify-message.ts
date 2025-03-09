import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { FETCH_API } from "~fetch.config"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage({
    area: "local"
  })

  const { message, signature } = req.body

  try {
    const response = await fetch(`${FETCH_API}/auth/siwe/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, signature })
    })

    if (response.ok) {
      const { jwt } = await response.json()
      await storage.set("fetch-auth", jwt)
      res.send({ success: true, message: "Verified" })
    }

    res.send({
      success: false,
      message: "Something happened. We are trying to fix it."
    })
  } catch (err) {
    res.send({
      success: false,
      message: "Cannot reach the server right now. Please try again later."
    })
  }
}

export default handler
