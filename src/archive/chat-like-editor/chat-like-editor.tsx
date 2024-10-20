import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"

import { Command, extensions } from "./commands"
import { RenderElement } from "./render-element"

export function ChatLikeEditor() {
  const [task, setTask] = useState([])
  const [cmdBoxValue, setCmdBoxValue] = useState("")
  const [isCommandActive, setIsCommandActive] = useState(true)
  const [selected, setSelected] = useState(0)
  const [serachedResults, setResults] = useState(extensions)
  const [command, setCommand] = useState("")
  const [focusedNode, setFocusedNode] = useState(0)

  useEffect(() => {
    if (task.length === 0) return
    const el = resultRefs?.current[focusedNode]
    el.focus()
  }, [focusedNode])

  const cmdBox = useRef(null)
  const resultRefs = useRef([])
  resultRefs.current = []

  const addToRef = (el: HTMLElement) => {
    if (el && !resultRefs.current.includes(el)) {
      resultRefs.current.push(el)
    }
  }

  const handleOnChange = (e) => {
    if (isCommandActive) {
      setCommand(e.target.value)
    }
    setCmdBoxValue(e.target.value)
  }

  const initCommand = () => {
    setIsCommandActive(true)
    setCommand("")
    setSelected(0)
  }

  const cycleNextExtension = () => {
    if (selected + 1 > serachedResults.length - 1) {
      setSelected(serachedResults.length - 1)
    } else {
      setSelected(selected + 1)
    }
  }

  const cyclePrevExtension = () => {
    if (selected - 1 < 0) setSelected(0)
    else setSelected(selected - 1)
  }

  useEffect(() => {
    if (!isCommandActive) return

    // const availableExtensions =
    //   task[0].type === "h"
    //     ? [...extensions].filter((ex) => ex.value !== "h")
    //     : extensions
    const availableExtensions = extensions
    const res: Array<any> = search(command, availableExtensions)
    setSelected(0)
    setResults(res)
  }, [command, isCommandActive])

  useEffect(() => {
    cmdBox.current.style.height = "36px"
    const h = cmdBox?.current?.scrollHeight + "px"
    cmdBox.current.style.height = h
  }, [cmdBoxValue])

  const handleOnKeyDown = (e) => {
    if (isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        if (serachedResults.length > 0) {
          //   setter(serachedResults[selected])
          setter()
          //   cmdBox.focus()
        }
      }
      if (e.key === " ") {
        setIsCommandActive(false)
      }
      // Arrow up to cycle through list
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        cyclePrevExtension()
      }

      // Arrow down to cycle through list
      else if (e.key === "ArrowDown") {
        e.preventDefault()
        cycleNextExtension()
      }
    }
    if (!isCommandActive) {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (e.target.selectionStart === 1 || e.target.selectionStart === 0) {
          initCommand()
        }
      }
      ///
      if (e.key === "Enter" || e.key === "Return") {
        e.preventDefault()
        if (cmdBoxValue.length > 0) {
          setTask([...task, { type: "p", value: cmdBoxValue }])
          setCmdBoxValue("")
          initCommand()
        }
      }
    }
  }

  const handleFocus = (index) => {
    setFocusedNode(index)

    // if (task[index].type === "h" || task[index].value.length > 0) {
    //   setIsCommandActive(false)
    //   return
    // }
    // if (task[index].value.length === 0 && !isCommandActive) {
    //   initCommand()
    // }
  }

  const updateNode = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const _task = [...task]
    _task[focusedNode].value = e.target.value
    setTask(_task)
  }

  const setter = () => console.log("set")

  return (
    <div>
      <div>
        <textarea
          value={cmdBoxValue}
          onKeyDown={handleOnKeyDown}
          ref={cmdBox}
          onChange={handleOnChange}
          className="flex items-center text-sm text-zinc-600 leading-tight px-2 py-2 justify-center border resize-none rounded-md w-[600px] overflow-y-hidden focus:ring-2 focus:ring-zinc-600 outline-zinc-600"
        />
        {/* {isCommandActive && (
          <div className="h-[0px]">
            <Command
              extensions={serachedResults}
              setter={setter}
              select={setSelected}
              selected={selected}
            />
          </div>
        )} */}
      </div>

      {task.length === 0 ? (
        <p>Add some stuff</p>
      ) : (
        task.map((t, i) => (
          <div key={`textarea-${i}`}>
            <RenderElement
              {...t}
              index={i}
              addToRef={addToRef}
              onKeyDown={handleOnKeyDown}
              onChange={updateNode}
              onFocus={handleFocus}
              //   onPaste={handlePaste}
            />
          </div>
        ))
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
