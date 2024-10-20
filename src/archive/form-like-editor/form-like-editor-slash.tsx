import isUrl from "is-url"
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Command, extensions } from "./commands"
import * as helpers from "./helpers"
import { RenderElement } from "./render-element"
import { RenderElementReadOnly } from "./render-element-readonly"
import { DateWithProps, TagsWithProps } from "./render-params"

const tagRegexp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z_]+\w*/g)

export default function FormLikeEditorSlash() {
  // useStorage is plasmo hook (see: https://docs.plasmo.com/framework/storage)
  const [tasks, setTasks, { remove }] = useStorage(
    {
      key: "middle-tasks",
      instance: new Storage({
        area: "local" // use "sync" for production to sync with logged in email.
      })
    },
    // A funtion to get storage by provided key ("middle-tasks") if exists.
    // if not exists (first use), initilize the empty array for storing tasks.
    (v: Array<any>) => (!v ? [] : v)
  )

  const [task, setTask] = useState([{ type: "h", value: "" }])
  const [taskParams, setTaskParams] = useState({ dueDate: -1, tags: [] })
  const [isCommandActive, setIsCommandActive] = useState(false)
  const [focusedNode, setFocusedNode] = useState(0)
  const [selected, setSelected] = useState(0)
  const [serachedResults, setResults] = useState(extensions)
  const [command, setCommand] = useState("")
  const [startCommand, setStartCommand] = useState(0)
  const [lastValueLength, setLastValueLength] = useState(0)

  const resultRefs = useRef([])
  resultRefs.current = []

  useEffect(() => {
    const deactivate = () => {
      if (!resultRefs.current.some((el) => el === document.activeElement)) {
        setIsCommandActive(false)
      }
    }

    document.addEventListener("click", deactivate)

    return () => document.removeEventListener("click", deactivate)
  }, [])

  const addToRef = (el: HTMLElement) => {
    if (el && !resultRefs.current.includes(el)) {
      resultRefs.current.push(el)
    }
  }

  const initCommand = (e) => {
    setIsCommandActive(true)
    setCommand("")
    setSelected(0)
    setStartCommand(e.target.selectionStart)
    setLastValueLength(task[focusedNode].value.length)
  }

  const updateCommand = (e) => {
    const _command = e.target.value.slice(
      startCommand + 1,
      e.target.value.length - lastValueLength + startCommand
    )
    setCommand(_command)
  }

  const resetTask = () => {
    setTask([{ type: "h", value: "" }])
    setTaskParams({ dueDate: -1, tags: [] })
    setIsCommandActive(false)
    setFocusedNode(0)
    setSelected(0)
    setResults(extensions)
    setCommand("")
  }

  const cyclePrevNode = () => {
    if (focusedNode === 0) return
    setFocusedNode(focusedNode - 1)
  }

  const cycleNextNode = () => {
    if (focusedNode === task.length - 1) return
    setFocusedNode(focusedNode + 1)
  }

  const cycleNextExtension = () => {
    if (selected === serachedResults.length - 1) return
    setSelected(selected + 1)
  }

  const cyclePrevExtension = () => {
    if (selected === 0) return
    else setSelected(selected - 1)
  }

  // Node Functions
  const addNode = (type: string, value = "") => {
    if (type === "h") {
      // Exit if there is Title
      if (task[0].type === "h") return

      setTask([{ type: "h", value }, ...task])
      setFocusedNode(0)
      return
    }
    //
    // if (focusedNode === task.length - 1) {
    //   setTask([...task, { type, value }])
    // }
    //
    else {
      setTask([...task].toSpliced(focusedNode + 1, 0, { type, value: "" }))
    }

    setFocusedNode(focusedNode + 1)
  }

  // const replaceNode = (type: string, value = "") => {
  //   setTask([...task].toSpliced(focusedNode, 1, { type, value }))
  //   setIsCommandActive(false)
  // }

  const replaceNodes = (nodes) => {
    setTask([...task].toSpliced(focusedNode, 1, ...nodes))
    setIsCommandActive(false)
    setFocusedNode(focusedNode + nodes.length - 1)
  }

  const deleteNode = () => {
    // Don't delete the first node
    if (focusedNode === 0) return

    const _task = [...task]
    _task.splice(focusedNode, 1)
    setTask(_task)
    setFocusedNode(focusedNode - 1)
  }

  const updateNode = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isCommandActive) updateCommand(e)

    const _task = [...task]
    _task[focusedNode].value = e.target.value
    setTask(_task)
  }

  const splitNode = (e) => {
    const p1 = task[focusedNode].value.slice(0, e.target.selectionStart)
    const p2 = task[focusedNode].value.slice(e.target.selectionStart)

    const nodes = [
      { type: task[focusedNode].type, value: p1 },
      { type: "p", value: p2 }
    ]

    replaceNodes(nodes)
  }

  const mergeNode = () => {
    if (focusedNode === 0) return
    if (focusedNode === 1 && task[0].type === "h") return

    const mergedContent = task[focusedNode - 1].value + task[focusedNode].value
    const mergedNode = { type: "p", value: mergedContent }

    setTask([...task].toSpliced(focusedNode - 1, 2, mergedNode))
    setFocusedNode(focusedNode - 1)
  }

  // Task params
  const addTags = () => {
    const _tags = []

    task.forEach((t) => {
      if (t.type !== "a") {
        const nodeTags = t.value.match(tagRegexp)
        if (nodeTags && nodeTags.length > 0) _tags.push(...nodeTags)
      }
    })

    const newTags = Array.from(new Set(_tags.map((tg) => tg.toLowerCase())))

    setTaskParams({ ...taskParams, tags: newTags })
  }

  const addDate = (dueDate) => setTaskParams({ ...taskParams, dueDate })

  // Setter
  const setter = (_extension: any) => {
    // Clear the text from cmd word
    // const _task = [...task]
    // _task[focusedNode].value = ""
    // setTask(_task)
    // Run
    setIsCommandActive(false)

    switch (_extension.action) {
      case "replaceNode":
        if (task[focusedNode].value.length === command.length + 1) {
          return replaceNodes([{ type: _extension.value, value: "" }])
        } else {
          const search = new RegExp("/" + command, "g")

          const currentTask = task[focusedNode]
          const newValue = currentTask.value.replace(search, "")
          const editedCurrentTask = { type: currentTask.type, value: newValue }
          const newNode = { type: _extension.value, value: "" }

          return replaceNodes([editedCurrentTask, newNode])
        }

      case "addDate":
        const currentTask = task[focusedNode]
        if (task[focusedNode].value.length === command.length + 1) {
          return replaceNodes([{ type: currentTask.type, value: "" }])
        } else {
          const search = new RegExp("/" + command, "g")
          const newValue = currentTask.value.replace(search, "")
          replaceNodes([{ type: currentTask.type, value: newValue }])
        }

        const _date =
          Math.floor(new Date().getTime() / 10_000) * 10_000 + _extension.value
        return addDate(_date)

      case "addNode":
        return addNode(_extension.value)
    }
  }
  // Handling Events/focus

  const handleFocus = (index: number) => setFocusedNode(index)

  const handlePaste = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const nodes = helpers.splitTextByUrls(e, task, focusedNode)
    replaceNodes(nodes)
  }

  const handleOnKeyDown = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> &
      KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const prevChar = e.target.value.charAt(e.target.selectionStart - 1).trim()

    // uncomment if want to accept only both side space pattern
    // const nextChar = e.target.value.charAt(e.target.selectionStart).trim()
    // add  && nextChar === ""

    // Activate command when press '/' on first input or preceeded by space(s)
    if (!isCommandActive && e.key === "/" && prevChar === "") {
      initCommand(e)
      return
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      if (e.target.selectionStart <= startCommand + 1) {
        setIsCommandActive(false)
      }

      if (e.target.selectionStart === 0) {
        // mergeNode()
        if (e.target.selectionEnd === e.target.selectionStart) {
          e.preventDefault()
          mergeNode()
          // if (e.target.value.length === 0) {
          //   deleteNode()
          // } else {
          //   mergeNode()
          // }
        }
      }
    }
    //
    if (!isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        // Title can be skipped if it is empty
        if (
          focusedNode === 0 &&
          e.target.value.length === 0 &&
          task[0].type === "h"
        ) {
          replaceNodes([{ type: "p", value: "" }])
          return
        }

        splitNode(e)
      } // Arrow up to cycle through list
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        cyclePrevNode()
      }
      // Arrow down to cycle through list
      else if (e.key === "ArrowDown") {
        e.preventDefault()
        cycleNextNode()
      }
    }

    if (isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        if (serachedResults.length > 0) {
          setter(serachedResults[selected])
        } else {
          addNode("p")
          setIsCommandActive(false)
        }
      }
      // Space to exit command
      else if (e.key === " " || e.key === "Space" || e.key === "/") {
        setIsCommandActive(false)
      }
      // When move text caret before '/'
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === startCommand + 1) {
          setIsCommandActive(false)
        }
      }
      // When move text caret forward
      else if (e.key === "ArrowRight") {
        if (e.target.selectionStart > startCommand + command.length) {
          setIsCommandActive(false)
        }
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
  }

  const onSubmit = () => {
    const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 0
    const newTask = { id, task, done: false, dateAdded: new Date() }
    setTasks([...tasks, newTask])

    resetTask()
  }

  // Effects
  useEffect(() => resultRefs?.current[focusedNode].focus(), [task, focusedNode])
  useEffect(() => addTags(), [focusedNode])
  useEffect(() => {
    if (!isCommandActive) return

    const availableExtensions = getAvailableExtensions(task, extensions)
    const res: Array<any> = search(command, availableExtensions)

    setSelected(0)
    setResults(res)
  }, [command, isCommandActive])

  return (
    <div className="w-[600px] border p-2">
      <button className="px-2 py-1 bg-gray-200 mb-10" onClick={onSubmit}>
        Aim
      </button>
      {taskParams.dueDate !== -1 && (
        <DateWithProps value={taskParams.dueDate} setter={addDate} />
      )}
      {taskParams.tags.length > 0 && <TagsWithProps tags={taskParams.tags} />}

      {task.map((t, i) => (
        <div className="flex flex-col" key={`textarea-${i}`}>
          <RenderElement
            {...t}
            index={i}
            addToRef={addToRef}
            onKeyDown={handleOnKeyDown}
            onChange={updateNode}
            onFocus={handleFocus}
            onPaste={handlePaste}
          />
          {isCommandActive && focusedNode === i && (
            <div className="h-[0px]">
              <Command
                extensions={serachedResults}
                setter={setter}
                select={setSelected}
                selected={selected}
              />
            </div>
          )}
        </div>
      ))}
      <div>
        {" "}
        <div className="mt-10 text-zinc-500">
          INBOX
          {tasks &&
            tasks.length > 0 &&
            tasks.map((t, i) => (
              <div className="border rounded-lg" key={`tasks_${i}`}>
                {t.task.map((node, i) => (
                  <div key={`node_${i}`}>
                    <RenderElementReadOnly {...node} />
                  </div>
                ))}
              </div>
            ))}
          <div className="my-2 border-t-[0.5px] py-2 border-rose-500">
            <button
              className="text-xs text-rose-500 border border-rose-500 rounded-lg p-1 hover:bg-gray-200 border-"
              onClick={() => remove()}>
              reset storage (dev only)
            </button>
          </div>
        </div>
      </div>
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

const getAvailableExtensions = (_task, _extensions) => {
  // Remove Title if There is one
  return _task[0].type === "h"
    ? _extensions.filter((ex) => ex.value !== "h")
    : _extensions
}
