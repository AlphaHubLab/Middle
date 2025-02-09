import { useEffect, useRef, useState } from "react"

import type { IExtenstion } from "~lib/types"

export const Command = ({ extensions, setter, command }) => {
  const [selected, setSelected] = useState(0)
  const [searched, setSearched] = useState<IExtenstion[]>(extensions)

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
      className="relative top-0 bg-white/40 backdrop-blur-sm border rounded-2xl p-1">
      {searched.length === 0 && (
        <div className="flex text-zinc-500 bg-transparent h-10 items-center text-xs px-2">
          No results
        </div>
      )}
      {searched.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto">
          {searched.map((ex: any, i: number) => (
            <div
              onMouseMove={() => setSelected(i)}
              key={`extension_${i}`}
              className={`flex justify-between text-sm h-10 p-2 py-3 rounded-xl ${selected === i ? "bg-zinc-200/50 active" : "bg-transparent"}`}
              onClick={() => setter(ex)}>
              <div className="text-sm flex gap-2 flex-auto items-center">
                <ex.icon />
                <span className="text-xs font-bold">{ex.title}</span>
              </div>
              <div className="text-xs text-zinc-400">{ex.description} </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const scrollToView = (el: HTMLDivElement) => {
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    })
  }
}
// This is a simple search
// Searching can be replaced with fusejs for fuzzy search if needed
// https://www.fusejs.io/
const search = (_command: string, _extensions: IExtenstion[]) => {
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
