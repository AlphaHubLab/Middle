import { useEffect, useState } from "react"

export default function TaskForm() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    links: [""],
    date: ""
  })

  const updateTask = (e) =>
    setTask({ ...task, [e.target.name]: e.target.value })

  const addLink = () => setTask({ ...task, links: [...task.links, ""] })

  const removeLink = (i: number) => {
    const _links = [...task.links]
    _links.splice(i, 1)
    setTask({ ...task, links: [..._links] })
  }

  const updateLink = (e) => {
    const _links = [...task.links]
    const index = e.target.name.slice(5, e.target.name.length)
    _links[index] = e.target.value

    setTask({ ...task, links: [..._links] })
  }

  return (
    <div className="w-96 text-sm">
      <div className="flex flex-col">
        <label className="text-zinc-400">Title</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={updateTask}
          className="p-2 border rounded-lg font-bold"
        />
      </div>
      <div className="flex flex-col mt-2">
        <label className="text-zinc-400">Description</label>
        <textarea
          name="description"
          onChange={updateTask}
          className="p-2 border rounded-lg"
        />
      </div>
      <div>
        {task.links.map((l, i) => (
          <div className="mt-2 flex flex-col" key={`link-${i}`}>
            <label className="text-zinc-400">Link #{i}</label>
            <div className="flex gap-2 items-center">
              <input
                value={task.links[i]}
                name={`link-${i}`}
                onChange={updateLink}
                className="p-2 border rounded-lg flex-auto"
              />
              <button
                onClick={() => removeLink(i)}
                className="hover:bg-zinc-100 text-xs h-9 w-9 py-1 px-2 bg-zinc-200 rounded-lg">
                -
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            onClick={addLink}
            className="hover:bg-zinc-100 mt-2 text-xs py-1 px-2 bg-zinc-200 rounded-lg">
            + Add link
          </button>
        </div>
      </div>
    </div>
  )
}
