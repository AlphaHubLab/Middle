import isUrl from "is-url"
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"
import { nodes } from "slate"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Command, extensions } from "./commands"
import * as helpers from "./helpers"
import { RenderElement } from "./render-element"
import { RenderElementReadOnly } from "./render-element-readonly"
import { DateWithProps, TagsWithProps } from "./render-params"

const tagRegexp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z_]+\w*/g)

export default function FormLikeEditor() {
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

  const addTags = () => {
    const _tags = []
    task.forEach((t) => {
      if (t.type !== "a") {
        const nodeTags = t.value.match(tagRegexp)
        if (nodeTags && nodeTags.length > 0) {
          _tags.push(...nodeTags)
        }
      }
    })

    const newTags = Array.from(new Set(_tags.map((tg) => tg.toLowerCase())))
    // const newTags = [...taskParams.tags, ..._tags]
    setTaskParams({ ...taskParams, tags: newTags })
  }

  const addDate = (dueDate) => setTaskParams({ ...taskParams, dueDate })

  const setter = (_extension: any) => {
    // Clear the text from cmd word
    const _task = [...task]
    _task[focusedNode].value = ""
    setTask(_task)
    // Run
    switch (_extension.action) {
      case "replaceNode":
        // if (task[focusedNode].type === _extension.value) {
        //   setCommandIsActice(false)
        //   return
        // }
        return replaceNode(_extension.value)
      case "addDate":
        const _date =
          Math.floor(new Date().getTime() / 10_000) * 10_000 + _extension.value
        addDate(_date)
        setIsCommandActive(false)
        return
      case "addNode":
        return addNode(_extension.value)
    }

    setIsCommandActive(false)
  }

  useEffect(() => {
    if (!isCommandActive) return

    const availableExtensions =
      task[0].type === "h"
        ? [...extensions].filter((ex) => ex.value !== "h")
        : extensions

    const res: Array<any> = search(command, availableExtensions)
    setSelected(0)
    setResults(res)
  }, [command, isCommandActive])

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

  const addNode = (type: string, value = "") => {
    if (type === "h") {
      // Exit if there is Title
      if (task[0].type === "h") return

      setTask([{ type: "h", value }, ...task])
    }
    //
    else if (focusedNode === task.length - 1) {
      setTask([...task, { type, value }])
    }
    //
    else {
      setTask([...task].toSpliced(focusedNode + 1, 0, { type, value: "" }))
    }

    setFocusedNode(focusedNode + 1)
    initCommand()
  }

  const replaceNode = (type: string, value = "") => {
    const _task = [...task]
    setTask([..._task].toSpliced(focusedNode, 1, { type, value }))
    setIsCommandActive(false)
  }

  const replaceNodes = (nodes) => {
    const _task = [...task]

    setTask([..._task].toSpliced(focusedNode, 1, ...nodes))
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
    if (isCommandActive) setCommand(e.target.value)

    const _task = [...task]
    _task[focusedNode].value = e.target.value
    setTask(_task)
  }

  const initCommand = () => {
    setIsCommandActive(true)
    setCommand("")
    setSelected(0)
  }

  useEffect(() => {
    const el = resultRefs?.current[focusedNode]
    el.focus()
  }, [task, focusedNode])

  useEffect(() => addTags(), [focusedNode])

  const handleFocus = (index: number) => {
    setFocusedNode(index)

    if (task[index].type === "h" || task[index].value.length > 0) {
      setIsCommandActive(false)
      return
    }
    if (task[index].value.length === 0 && !isCommandActive) {
      initCommand()
    }
  }

  const handlePaste = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const nodes = helpers.splitTextByUrls(e, task, focusedNode)
    replaceNodes(nodes)
  }

  const splitNode = (e) => {
    const p1 = task[focusedNode].value.slice(0, e.target.selectionStart)
    const p2 = task[focusedNode].value.slice(e.target.selectionStart)

    const nodes = [
      { type: "p", value: p1 },
      { type: "p", value: p2 }
    ]
    replaceNodes(nodes)
  }

  const handleOnKeyDown = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> &
      KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      // Delete the last char
      if (task[focusedNode].type !== "h") {
        if (e.target.selectionStart === 1) {
          initCommand()
        }

        // cmd/ctrl + A and delete
        if (e.target.selectionStart === 0) {
          if (e.target.value.length === 0) {
            e.preventDefault()
            deleteNode()
          } else {
            initCommand()
          }
        }
      }
    }
    //
    if (!isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        if (
          task[focusedNode].value.length > 0
          // &&
          // e.target.selectionStart < task[focusedNode].value.length
        ) {
          splitNode(e)
          return
        }
        // Title can be skipped if it is empty
        if (
          focusedNode === 0 &&
          e.target.value.length === 0 &&
          task[0].type === "h"
        ) {
          replaceNode("p")
          initCommand()
          return
        }

        // addNode("p")
        addTags()
      }
    }

    if (isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        if (serachedResults.length > 0) {
          setter(serachedResults[selected])
        } else {
          addNode("p")
        }
      }
      // Space to exit command
      else if (e.key === "Space" || e.key === " ") {
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

  const onSubmit = () => {
    const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 0
    const newTask = { id, task, done: false, dateAdded: new Date() }
    setTasks([...tasks, newTask])

    resetTask()
  }

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
