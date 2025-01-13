import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  //   const message = await querySomeApi(req.body.id)

  //   res.send({
  //     message
  //   })
  res.send(req.body.id + 2)
}

export default handler
