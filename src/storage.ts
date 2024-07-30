import { Storage } from "@plasmohq/storage"

export async function addTodo(todo) {
  const storage = new Storage()
  //   try {
  // const tasks = (await storage.get("middle-tasks")) || []
  console.log(localStorage.getItem("middle-tasks"))
  localStorage.setItem("middle-tasks", "b")
  await storage.set("middle-tasks", "s")
  //   } catch (err) {
  //     console.log(err)
  //   }
}

// export async function getTodo() {
//   return await storage.get("middle-tasks")
// }
// await storage.set("serial-number", 47)
// await storage.set("make", "plasmo-corp")

// storage.watch({
//   "serial-number": (c) => {
//     console.log(c.newValue)
//   },
//   make: (c) => {
//     console.log(c.newValue)
//   }
// })

// await storage.set("serial-number", 96)
// await storage.set("make", "PlasmoHQ")
