import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { FETCH_API } from "~fetch.config"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage({
    area: "local"
  })

  try {
    const jwt = await storage.get("fetch-auth")

    if (jwt.length === 0) {
      res.send({ success: true, message: "SignedOut" })
    }

    const response = await fetch(`${FETCH_API}/auth/siwe/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jwt })
    })

    if (response.ok) {
      await storage.set("fetch-auth", "")
      res.send({ success: true, message: "SignedOut" })
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
