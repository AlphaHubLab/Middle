import isUrl from "is-url"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
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
  // const [tasks, setTasks, { remove }] = useStorage(
  //   {
  //     key: "middle-tasks",
  //     instance: new Storage({
  //       area: "local" // use "sync" for production to sync with logged in email.
  //     })
  //   },
  //   // A funtion to get storage by provided key ("middle-tasks") if exists.
  //   // if not exists (first use), initilize the empty array for storing tasks.
  //   (v: Array<any>) => (!v ? [] : v)
  // )

  const [task, setTask] = useState([{ type: "h", value: "" }])
  const [taskParams, setTaskParams] = useState({ dueDate: -1, tags: [] })
  const [isCommandActive, setIsCommandActive] = useState(false)
  const [focusedNode, setFocusedNode] = useState(0)
  const [selected, setSelected] = useState(0)
  const [serachedResults, setResults] = useState(extensions)
  const [command, setCommand] = useState("")
  const [startCommand, setStartCommand] = useState(0)
  const [lastValueLength, setLastValueLength] = useState(0)
  const [range, setRange] = useState(0)

  const resultRefs = useRef([])
  resultRefs.current = []
  const undos = useRef([])
  const redos = useRef([])

  useEffect(() => {
    const deactivate = () => {
      setRange(-1)
      if (!resultRefs.current.some((el) => el === document.activeElement)) {
        setIsCommandActive(false)
      }
    }

    document.addEventListener("click", deactivate)

    return () => document.removeEventListener("click", deactivate)
  }, [])

  useEffect(() => {
    if (range === -1) return
    resultRefs.current[focusedNode].setSelectionRange(range, range)
    console.log(range)
  }, [range, task])

  const addToRef = (el: HTMLElement) => {
    if (el && !resultRefs.current.includes(el)) {
      resultRefs.current.push(el)
    }
  }

  const updateTask = (_task) => {
    if (undos.current.length > 15) {
      undos.current.shift()
    }
    if (redos.current.length > 0) {
      redos.current = []
    }
    undos.current.push([..._task])
    setTask(_task)
  }

  console.log(undos.current)

  const undo = () => {
    if (undos.current.length === 0) return
    const last = undos.current[undos.current.length - 1]
    console.log(last)
    redos.current.push(last)
    undos.current.pop()
    setTask(last)
    setFocusedNode(0)
  }

  const redo = () => {
    if (redos.current.length === 0) return
    undos.current.push(redos.current[redos.current.length - 1])
    redos.current.pop()
    setTask(undos.current[undos.current.length - 1])
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

  const prevNode = (e) => {
    e.preventDefault()
    if (focusedNode === 0) return
    setRange(task[focusedNode - 1].value.length + 1)
    setFocusedNode(focusedNode - 1)
  }

  const nextNode = (e) => {
    e.preventDefault()
    if (focusedNode === task.length - 1) return
    e.preventDefault()
    setFocusedNode(focusedNode + 1)
  }

  const nextExtenstion = () => {
    if (selected === serachedResults.length - 1) return
    setSelected(selected + 1)
  }

  const prevExtension = () => {
    if (selected === 0) return
    else setSelected(selected - 1)
  }

  // Node Functions
  const addNode = (type: string, value = "") => {
    if (type === "h") {
      // Exit if there is Title
      if (task[0].type === "h") return

      updateTask([{ type: "h", value }, ...task])
      //setTask([{ type: "h", value }, ...task])
      setFocusedNode(0)
      setRange(0)
      return
    }
    //
    // if (focusedNode === task.length - 1) {
    //   setTask([...task, { type, value }])
    // }
    //
    else {
      updateTask([...task].toSpliced(focusedNode + 1, 0, { type, value: "" }))
      //setTask([...task].toSpliced(focusedNode + 1, 0, { type, value: "" }))
    }

    setFocusedNode(focusedNode + 1)
    setRange(-1)
  }

  // const replaceNode = (type: string, value = "") => {
  //   setTask([...task].toSpliced(focusedNode, 1, { type, value }))
  //   setIsCommandActive(false)
  // }

  const replaceNodes = (nodes, range = null) => {
    updateTask([...task].toSpliced(focusedNode, 1, ...nodes))
    //setTask([...task].toSpliced(focusedNode, 1, ...nodes))
    setIsCommandActive(false)
    setFocusedNode(focusedNode + nodes.length - 1)
    range = range ?? 0
    setRange(range)
  }

  const deleteNode = () => {
    // Don't delete the first node
    if (focusedNode === 0) return

    const _task = [...task]
    _task.splice(focusedNode, 1)
    updateTask(_task)
    //setTask(_task)
    setFocusedNode(focusedNode - 1)
  }

  const updateNode = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isCommandActive) updateCommand(e)

    const _task = [...task]
    _task[focusedNode].value = e.target.value
    updateTask(_task)
    // setTask(_task)
    setRange(-1)
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
    const part1 = task[focusedNode - 1].value
    const part2 = task[focusedNode].value
    const mergedContent = part1 + part2
    const mergedNode = { type: "p", value: mergedContent }

    updateTask([...task].toSpliced(focusedNode - 1, 2, mergedNode))
    //setTask([...task].toSpliced(focusedNode - 1, 2, mergedNode))
    setRange(part1.length)
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
          replaceNodes([{ type: currentTask.type, value: "" }])
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
    replaceNodes(nodes, nodes[nodes.length - 1].value.length)
  }

  const handleOnKeyDown =
    //  useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> &
        KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const prevChar = e.target.value.charAt(e.target.selectionStart - 1).trim()

      if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault()
        undo()
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault()
        redo()
      }
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
          prevNode(e)
        }
        // Arrow down to cycle through list
        else if (e.key === "ArrowDown") {
          nextNode(e)
        }
        // When move text caret
        else if (e.key === "ArrowLeft") {
          if (e.target.selectionStart === 0) {
            prevNode(e)
          }
          // setRange(-1)
        }
        // When move text caret
        else if (e.key === "ArrowRight") {
          if (e.target.selectionStart === task[focusedNode].value.length) {
            nextNode(e)
          }
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
          prevExtension()
        }
        // Arrow down to cycle through list
        else if (e.key === "ArrowDown") {
          e.preventDefault()
          nextExtenstion()
        }
      }
    }
  //   ,
  //   [task]
  // )

  // const onSubmit = () => {
  //   const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 0
  //   const newTask = { id, task, done: false, dateAdded: new Date() }
  //   setTasks([...tasks, newTask])

  //   resetTask()
  // }

  // Effects
  useEffect(() => {
    resultRefs?.current[focusedNode].focus()
  })

  useEffect(() => {
    addTags()
    setIsCommandActive(false)
  }, [focusedNode])

  useEffect(() => {
    if (!isCommandActive) return

    const availableExtensions = getAvailableExtensions(task, extensions)
    const res: Array<any> = search(command, availableExtensions)

    setSelected(0)
    setResults(res)
  }, [command, isCommandActive])

  return (
    <div className="w-[600px] border p-2">
      {/* <button className="px-2 py-1 bg-gray-200 mb-10" onClick={onSubmit}>
        Aim
      </button> */}
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
            <div className="ml-4 h-[0px]">
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
        {/* <div className="mt-10 text-zinc-500">
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
        </div> */}
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

function useAsRef<T>(data: T) {
  const ref = useRef<T>(data)

  useLayoutEffect(() => {
    ref.current = data
  })

  return ref
}
