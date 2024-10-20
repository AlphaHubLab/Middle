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

export const Command = ({ extensions, setter, select, selected }) => {
  const ref = useRef(null)

  useEffect(() => {
    const _selected = ref?.current?.querySelector(".active")

    if (_selected) {
      _selected?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }
  }, [selected])

  return (
    <div
      ref={ref}
      className="relative top-0 bg-white/40 backdrop-blur-sm border rounded-xl p-1 z-100">
      {extensions.length === 0 && (
        <div className="flex text-zinc-500 bg-transparent h-10 items-center text-xs">
          No results
        </div>
      )}
      {extensions.length > 0 && (
        <div
          className={`overflow-y-auto h-[${extensions.length >= 5 ? "200" : (extensions.length * 40).toString()}px]`}>
          {extensions.map((ex: any, i: number) => (
            <div
              onMouseMove={() => select(i)}
              key={`extension_${i}`}
              className={`text-xs flex justify-between text-sm h-10 p-2 py-3 rounded-md ${selected === i ? "bg-zinc-200/50 active" : "bg-transparent"}`}
              onClick={() => setter(ex)}>
              <div className="flex gap-2 flex-auto">
                <ex.icon />
                <span className="font-bold">{ex.title} </span>
              </div>
              <div className="text-zinc-400">{ex.description} </div>

              {/* <span className="text-zinc-700">value: {ex.value} </span>
              <span className="text-zinc-500">
                Keywords:{" "}
                {ex.keywords.map((e: string) => (
                  <span>{e} </span>
                ))}
              </span> */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
