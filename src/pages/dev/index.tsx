import {
  useEffect,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent
} from "react"
import type { IconType } from "react-icons"
import { IoFilterCircleOutline } from "react-icons/io5"
import { LuListFilter } from "react-icons/lu"
import { MdFilterHdr } from "react-icons/md"

export interface Extenstion {
  icon: IconType
  title: string
  value: string
  keywords: Array<string>
}

const extensions = [
  {
    icon: IoFilterCircleOutline,
    title: "Apple",
    value: "apple",
    keywords: ["sib", "fruit"]
  },
  {
    icon: MdFilterHdr,
    title: "Pen",
    value: "pen",
    keywords: ["write", "text"]
  },
  {
    icon: LuListFilter,
    title: "Dog",
    value: "dog",
    keywords: ["pet", "fun"]
  }
]

export default function Page() {
  return (
    <div className="flex w-full justify-center mt-96">
      <TaskBox />
    </div>
  )
}

function TaskBox() {
  const [showCommand, setShowCommand] = useState(false)
  const [value, setValue] = useState("")
  const [command, setCommand] = useState("")
  const [startCommand, setStartCommand] = useState(0)
  const [lastValueLength, setLastValueLength] = useState(0)
  const [serachedResults, setResults] = useState(extensions)
  const [selected, setSelected] = useState(0)

  // Searching can be replaced with fusejs for fuzzy search if needed
  // https://www.fusejs.io/
  const search = (_command: string) => {
    const searchKey = new RegExp(_command.trim().toLowerCase(), "g")

    return extensions.filter(
      (ex) =>
        ex.value.match(searchKey) ||
        ex.title.match(searchKey) ||
        ex.keywords.map((k) => k.match(searchKey)).filter((r) => r).length > 0
    )
  }

  const cycleNextExtension = () => {
    if (selected + 1 > serachedResults.length - 1) {
      setSelected(serachedResults.length - 1)
    } else {
      setSelected(selected + 1)
    }
  }

  const cyclePrevExtension = () => {
    if (selected - 1 < 0) {
      setSelected(0)
    } else {
      setSelected(selected - 1)
    }
  }

  const initCommand = (e) => {
    setStartCommand(e.target.selectionStart)
    setShowCommand(true)
    setCommand("")
    setLastValueLength(value.length)
  }

  const handleKeyDown = (
    e: KeyboardEvent & ChangeEvent<HTMLTextAreaElement>
  ) => {
    const previousChar = e.target.value
      .charAt(e.target.selectionStart - 1)
      .trim()

    // uncomment if want to accept only both side space pattern
    // const nextChar = e.target.value.charAt(e.target.selectionStart).trim()

    // Activate command when press '/' on first input or preceeded by space(s)
    if (
      !showCommand &&
      e.key === "/" &&
      previousChar === ""
      // &$ nextChar === ""
    ) {
      initCommand(e)
    }

    if (showCommand) {
      // If "cmd/ctrl + A" and Delete
      if (e.target.selectionStart === 0) {
        setShowCommand(false)
      }

      // If delete the last '/'
      else if (e.key === "Backspace" || e.key === "Delete") {
        if (e.target.selectionStart === startCommand + 1) {
          setShowCommand(false)
        }
      }

      // If press 'space' when command is active
      else if (e.key === " " || e.key === "Space" || e.key === "/") {
        setShowCommand(false)
      }

      // When move text cursor before '/'
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === startCommand + 1) {
          setShowCommand(false)
        }
      }

      // When move text cursor forward
      else if (e.key === "ArrowRight") {
        if (e.target.selectionStart > startCommand + command.length) {
          setShowCommand(false)
        }
      }

      // Arrow up to cycle throw list
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        cyclePrevExtension()
      }

      // Arrow down to cycle throw list
      else if (e.key === "ArrowDown") {
        e.preventDefault()
        cycleNextExtension()
      }

      // Run the selected extension
      else if (e.key === "Enter" || e.key === "Return") {
        e.preventDefault()
        setter(serachedResults[selected])
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value)

  useEffect(() => {
    if (!showCommand) return

    const _command = value.slice(
      startCommand + 1,
      value.length - lastValueLength + startCommand
    )

    setCommand(_command)

    const res = search(_command)

    setSelected(0)
    setResults(res)
  }, [value])

  const setter = (_extension: Extenstion) => {
    const search = new RegExp("/" + command, "g")
    const newValue = value.replace(search, _extension.value)
    setValue(newValue)
    setShowCommand(false)
  }

  return (
    <div className="w-96 flex flex-col">
      <textarea
        value={value}
        spellCheck={false}
        className="border w-full rounded-t-xl p-2"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      {showCommand && (
        <div>
          {/* cmd: {command} - {command.length} char */}
          <List
            select={setSelected}
            selected={selected}
            extensions={serachedResults}
            setter={setter}
          />
        </div>
      )}
      {!showCommand && <div className="border-b border-l border-r rounded-b-xl p-1 text-sm text-zinc-500">type / </div>}
    </div>
  )
}

const List = ({ extensions, setter, select, selected }) => {
  return (
    <div className="border-b border-l border-r rounded-b-xl p-1">
      {extensions.length > 0 && (
        <div>
          {extensions.length === 0 && <div>No results</div>}
          {extensions.map((ex: Extenstion, i: number) => (
            <div
              onMouseOver={() => select(i)}
              key={`extension_${i}`}
              className={`flex justify-between text-sm p-1 bg-white rounded-md ${selected === i && "bg-zinc-200"}`}
              onClick={() => setter(ex)}>
              <div className="flex gap-2">
                <ex.icon />
                <span className="font-bold">{ex.title} </span>
              </div>

              <span className="text-zinc-700">value: {ex.value} </span>
              <span className="text-zinc-500">
                Keywords:{" "}
                {ex.keywords.map((e: string) => (
                  <span>{e} </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
