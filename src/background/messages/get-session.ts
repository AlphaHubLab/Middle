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
      res.send({ session: null, message: "Unauthorized" })
    }

    const response = await fetch(`${FETCH_API}/auth/siwe/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jwt })
    })

    if (response.status === 201) {
      const json = await response.json()
      const { address, chainId, message } = json
      res.send({ session: { address, chainId }, message })
    } else if (response.status === 401) {
      res.send({ session: null, message: "Unauthorized" })
    } else {
      res.send({
        session: null,
        message: "Something happened. We are trying to fix it."
      })
    }
  } catch (err) {
    res.send({
      session: null,
      message: "Cannot reach the server right now. Please try again later."
    })
  }
}

export default handler
