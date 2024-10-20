import { useEffect, useRef, useState } from "react"

import type { Extenstion } from "~lib/types"

const scrollToView = (el: HTMLDivElement) => {
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    })
  }
}

export const Command = ({ extensions, setter, command }) => {
  const [selected, setSelected] = useState(0)
  const [searched, setSearched] = useState<Extenstion[]>(extensions)

  const cmd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.stopPropagation()
        e.preventDefault()

        if (searched.length > 0) setter(searched[selected])
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
    const find = search(command, extensions)
    setSelected(0)
    setSearched(find)
  }, [command])

  useEffect(() => {
    const _selected = cmd?.current?.querySelector(".active") as HTMLDivElement
    scrollToView(_selected)
  }, [selected])

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
const search = (_command: string, _extensions: Extenstion[]) => {
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
