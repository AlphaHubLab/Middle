import { useEffect, useRef, useState } from "react"
import { IoFilterCircleOutline } from "react-icons/io5"
import { LuListFilter } from "react-icons/lu"
import { MdFilterHdr } from "react-icons/md"

export const extensions = [
  {
    icon: MdFilterHdr,
    title: "Add Title",
    value: "h",
    action: "addNode",
    description: "Add a main title",
    keywords: ["header", "title"]
    // run: () => console.log("run pen")
  },
  {
    icon: MdFilterHdr,
    title: "Text",
    value: "p",
    action: "replaceNode",
    description: "Add a simple paragraph",
    keywords: ["write", "text", "paragraph"]
    // run: () => console.log("run pen")
  },

  {
    icon: IoFilterCircleOutline,
    title: "Link",
    value: "a",
    action: "replaceNode",
    description: "Add a link",
    keywords: ["link", "web", "site"]
    // run: () => console.log("run apple")
  },

  {
    icon: MdFilterHdr,
    title: "Date",
    value: 0,
    action: "addDate",
    description: "Add a due date",
    keywords: ["expire", "due"]
    // run: () => console.log("run Cae")
  },
  {
    icon: MdFilterHdr,
    title: "Next 24H",
    value: 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in next 24H",
    keywords: ["24", "24h", "day", "date"]
    // run: () => console.log("run Cae")
  },
  {
    icon: MdFilterHdr,
    title: "Next 7Days",
    value: 7 * 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in the next week",
    keywords: ["7", "7d", "week", "date"]
    // run: () => console.log("run Cae")
  }
]

const scrollToView = (el) => {
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    })
  }
}

export const CommandInDep = ({ extensions, setter, command }) => {
  const cmd = useRef(null)
  const [selected, setSelected] = useState(0)
  const [searched, setSearched] = useState(extensions)

  useEffect(() => {
    const down = (e) => {
      if (e.key === "Enter") {
        e.stopPropagation()
        e.preventDefault()

        if (searched.length > 0) {
          setter(searched[selected])
        }
      }
      // Cycle up extensions
      else if (e.key === "ArrowDown") {
        e.stopPropagation()
        e.preventDefault()

        if (searched.length === 0) return

        setSelected((prev) => (prev === searched.length - 1 ? prev : prev + 1))
      }
      // Cycle down extensions
      else if (e.key === "ArrowUp") {
        e.stopPropagation()
        e.preventDefault()

        if (searched.length === 0) return

        setSelected((prev) => (prev === 0 ? prev : prev - 1))
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [searched, selected])

  useEffect(() => {
    const find: Array<any> = search(command, extensions)
    setSelected(0)
    setSearched(find)
  }, [command])

  useEffect(() => {
    const _selected = cmd?.current?.querySelector(".active")
    scrollToView(_selected)
  }, [selected])

  console.log(command)
  return (
    <div
      ref={cmd}
      className="relative top-0 bg-white/40 backdrop-blur-sm border rounded-xl p-1 z-100">
      {searched.length === 0 && (
        <div className="flex text-zinc-500 bg-transparent h-10 items-center text-xs">
          No results
        </div>
      )}
      {searched.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto">
          {searched.map((ex: any, i: number) => (
            <div
              onMouseMove={() => setSelected(i)}
              key={`extension_${i}`}
              className={`text-xs flex justify-between text-sm h-10 p-2 py-3 rounded-md ${selected === i ? "bg-zinc-200/50 active" : "bg-transparent"}`}
              onClick={() => setter(ex)}>
              <div className="flex gap-2 flex-auto">
                <ex.icon />
                <span className="font-bold">{ex.title} </span>
              </div>
              <div className="text-zinc-400">{ex.description} </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// This is a simple search
// Searching can be replaced with fusejs for fuzzy search if needed
// https://www.fusejs.io/
const search = (_command: string, _extensions: Array<any>) => {
  if (_command.match(/\/|\\|\*|\[|\]|\(|\)|\+|\?|\:|\^|\$|\|/g)) {
    return []
  }

  const searchKey = new RegExp(_command.trim().toLowerCase(), "g")

  return _extensions.filter(
    (ex) =>
      // ex.value.match(searchKey) ||
      ex.title.match(searchKey) ||
      ex.keywords.map((k) => k.match(searchKey)).filter((r) => r).length > 0
  )
}
