import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"

import useDraft from "~hooks/useDraft"
import * as helpers from "~lib/task-helpers"
import type { Extenstion, Node, NodeType, Store } from "~lib/types"

import { Command } from "./commands"
import { extensions } from "./extenstions"
import { RenderElement } from "./render-element"

// import { RenderElementReadOnly } from "./render-element-readonly"
// import { DateWithProps, TagsWithProps } from "./render-params"

const tagRegexp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z_]+\w*/g)

const getAvailableExtensions = (_task: Node[], _extensions: Extenstion[]) => {
  // Remove Title if There is one
  return helpers.hasTitle(_task)
    ? _extensions.filter((ex) => ex.value !== "h")
    : _extensions
}

export default function Editor({
  disabled,
  drafts,
  setDrafts,
  setStorage,
  storageLoading
}) {
  const [isCommandActive, setIsCommandActive] = useState(false)
  const [command, setCommand] = useState("")

  /** Main store */
  const [store, setStore] = useState<Store>(helpers.getInitialStore())

  const { isLoading } = useDraft(store, drafts, setDrafts, storageLoading, 1000)

  const nodes = useRef([])
  const undos = useRef([])
  const redos = useRef([])
  const cmdStartPos = useRef(0)
  const nodeSnapshot = useRef("")

  // nodes.current = []

  const addToRef = (el: HTMLElement) => {
    if (el && !nodes.current.includes(el)) nodes.current.push(el)
  }

  /** Effects */
  useEffect(() => {
    const deactivate = () => {
      if (!nodes.current.some((el) => el === document.activeElement)) {
        setIsCommandActive(false)
      }
    }

    document.addEventListener("click", deactivate)
    return () => document.removeEventListener("click", deactivate)
  }, [])

  useEffect(() => {
    if (store.range === -1) return
    nodes.current[store.focusedNode].setSelectionRange(store.range, store.range)
  }, [store.range, store.task])

  useEffect(() => {
    if (disabled) return
    nodes?.current[store.focusedNode].focus()
  })

  useEffect(() => {
    addTags()
    setIsCommandActive(false)
  }, [store.focusedNode])

  const undo = () => {
    if (undos.current.length === 0) return
    const last = undos.current[undos.current.length - 1]
    redos.current.push(store)
    undos.current.pop()
    setStore(last)
  }

  const redo = () => {
    if (redos.current.length === 0) return
    const last = redos.current[redos.current.length - 1]
    undos.current.push(store)
    redos.current.pop()
    setStore(last)
  }

  const updateHistory = (store: Store) => {
    if (undos.current.length > 15) undos.current.shift()
    if (redos.current.length > 0) redos.current = []
    undos.current.push(store)
  }

  const initCommand = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsCommandActive(true)
    setCommand("")
    cmdStartPos.current = e.target.selectionStart
    nodeSnapshot.current = store.task[store.focusedNode].value
  }

  const updateCommand = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const _command = e.target.value.slice(
      cmdStartPos.current + 1,
      e.target.value.length - nodeSnapshot.current.length + cmdStartPos.current
    )
    setCommand(_command)
  }

  const prevNode = (e: KeyboardEvent) => {
    e.preventDefault()
    if (store.focusedNode === 0) return

    setStore({
      ...store,
      range: store.task[store.focusedNode - 1].value.length,
      focusedNode: store.focusedNode - 1
    })
  }

  const nextNode = (e: KeyboardEvent) => {
    e.preventDefault()
    if (store.focusedNode === store.task.length - 1) return
    setStore({ ...store, focusedNode: store.focusedNode + 1 })
  }

  /** Node functions */
  const addNode = (type: NodeType, value = "") => {
    // 'h' can not be added twice
    if (type === "h") {
      if (helpers.hasTitle(store.task)) return
      const newstore = {
        ...store,
        task: [{ type, value }, ...store.task],
        focusedNode: 0,
        range: 0
      }

      updateHistory(store)
      setStore(newstore)
    } else {
      const newStore = {
        ...store,
        range: -1,
        focusedNode: store.focusedNode - 1,
        task: store.task.toSpliced(store.focusedNode + 1, 0, {
          type,
          value: ""
        })
      }

      updateHistory(store)
      setStore(newStore)
    }
  }

  const replaceNodes = (nodes: Node[], range = null) => {
    const newStore = {
      ...store,
      task: store.task.toSpliced(store.focusedNode, 1, ...nodes),
      range: range ? range : 0,
      focusedNode: store.focusedNode + nodes.length - 1
    }

    updateHistory(store)
    setStore(newStore)
  }

  const updateNode = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isCommandActive) updateCommand(e)

    // Shallow copy also works, but maybe produces some bugs
    // const task = [...store.task]
    
    const task = structuredClone(store.task)
    task[store.focusedNode].value = e.target.value
    const newStore = { ...store, task, range: -1 }
    setStore(newStore)
  }

  const splitNode = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const node = store.task[store.focusedNode]

    const p1 = node.value.slice(0, e.target.selectionStart).trim()
    const p2 = node.value.slice(e.target.selectionStart).trim()

    const t1 = helpers.getNodeType(node, p1)
    const t2 = helpers.getNodeType({ value: node.value, type: null }, p2)

    const nodes = [
      { type: t1, value: p1 },
      { type: t2, value: p2 }
    ]

    replaceNodes(nodes)
  }

  const mergeNode = () => {
    if (store.focusedNode === 0) return

    const p1 = store.task[store.focusedNode - 1].value
    const p2 = store.task[store.focusedNode].value
    const mergedValue = p1 + p2

    const type = helpers.getNodeType(
      store.task[store.focusedNode - 1],
      mergedValue
    )

    const mergedNode = { type, value: mergedValue }

    const newStore = {
      ...store,
      task: store.task.toSpliced(store.focusedNode - 1, 2, mergedNode),
      range: p1.length,
      focusedNode: store.focusedNode - 1
    }

    updateHistory(store)
    setStore(newStore)
  }

  // Task params
  const addTags = () => {
    const _tags = []

    store.task.forEach((t) => {
      if (t.type !== "a") {
        const nodeTags = t.value.match(tagRegexp)
        if (nodeTags && nodeTags.length > 0) _tags.push(...nodeTags)
      }
    })

    const newTags = Array.from(new Set(_tags.map((t) => t.toLowerCase())))

    const params = { ...store.params, tags: newTags }
    setStore({ ...store, params })
  }

  const addDate = (dueDate: number) => {
    const params = { ...store.params, dueDate }

    const newStore = {
      ...store,
      task: store.task.toSpliced(store.focusedNode, 1, {
        type: store.task[store.focusedNode].type as NodeType,
        value: nodeSnapshot.current
      }),
      range: nodeSnapshot.current.length,
      focusedNode: store.focusedNode,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  /** Setter */
  const setter = (_extension: any) => {
    setIsCommandActive(false)

    switch (_extension.action) {
      case "replaceNode":
        if (store.task[store.focusedNode].value.trim() === `/${command}`) {
          // Replace current node if it is empty
          replaceNodes([{ type: _extension.value, value: "" }])
          break
        }

        // Add a new node if current node has text
        const newNode = { type: _extension.value, value: "" }
        const currentNode = {
          type: store.task[store.focusedNode].type,
          value: nodeSnapshot.current
        }

        replaceNodes([currentNode, newNode])
        break

      case "addDate":
        const now = new Date().getTime()
        const dueDate = Math.floor(now / 10_000) * 10_000 + _extension.value
        addDate(dueDate)
        break

      case "addNode":
        addNode(_extension.value)
        break
    }
  }

  const storeAndReset = () => {
    setStorage((prev) => [...prev, store])
    setStore(helpers.getInitialStore())
    setCommand("")
    setIsCommandActive(false)
  }

  /** Handling Events/focus */
  const handleFocus = (index: number) => {
    if (store.focusedNode === index) return
    setStore({ ...store, focusedNode: index })
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const nodes = helpers.splitTextByUrls(e, store)
    replaceNodes(nodes, nodes[nodes.length - 1].value.length)
  }

  const handleOnKeyDown = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> &
      KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const prevChar = e.target.value.charAt(e.target.selectionStart - 1).trim()

    // Undo: cmd | ctrl + z
    if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
      e.preventDefault()
      return undo()
    }

    // Redo: cmd | ctrl + y
    if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y")) {
      e.preventDefault()
      return redo()
    }

    // Activate command when press '/' on first input or preceeded by space(s)
    // uncomment and add && nextChar === "" if want to accept only both side space pattern
    // const nextChar = e.target.value.charAt(e.target.selectionStart).trim()
    if (!isCommandActive && e.key === "/" && prevChar === "") {
      return initCommand(e)
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      // If Delete the starter '/' => Deactivating command
      if (
        isCommandActive &&
        e.target.selectionStart <= cmdStartPos.current + 1
      ) {
        return setIsCommandActive(false)
      }

      // If Caret pos = 0 => Delete the node or Merge with previous one
      if (e.target.selectionStart === 0) {
        if (e.target.selectionEnd === e.target.selectionStart) {
          e.preventDefault()
          return mergeNode()
        }
      }
    }

    if (!isCommandActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        // Empty Title can be skipped and turned to 'p'
        // if (
        //   store.focusedNode === 0 &&
        //   e.target.value.length === 0 &&
        //   store.task[0].type === "h"
        // ) {
        //   return replaceNodes([{ type: "p", value: "" }])
        // }
        return splitNode(e)
      }

      // Tags
      else if (e.key === " " || e.key === "Space") {
        addTags()
      }

      // Cycle next node
      else if (e.key === "ArrowUp") {
        return prevNode(e)
      }

      // Cycle prev node
      else if (e.key === "ArrowDown") {
        return nextNode(e)
      }

      // Cycle next node if caret is on the start
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === 0) {
          return prevNode(e)
        }
      }

      // Cycle prev node if caret is on the end
      else if (e.key === "ArrowRight") {
        if (
          e.target.selectionStart === store.task[store.focusedNode].value.length
        ) {
          return nextNode(e)
        }
      }
    }

    if (isCommandActive) {
      // Be handled on Command Component
      if (e.key === "Enter") {
        e.preventDefault()
      }

      // Command exited with "Space"
      else if (e.key === " " || e.key === "Space" || e.key === "/") {
        return setIsCommandActive(false)
      }

      // When move caret before initializre '/'
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === cmdStartPos.current + 1) {
          setIsCommandActive(false)
        }
      }

      // When move caret after command boundry
      else if (e.key === "ArrowRight") {
        if (e.target.selectionStart > cmdStartPos.current + command.length) {
          setIsCommandActive(false)
        }
      }
    }
  }

  return (
    <div className={`w-full`}>
      <button disabled={disabled} onClick={storeAndReset}>
        store
      </button>
      <div>
        {store.task.map((t, i) => (
          <div className="flex flex-col" key={`textarea-${i}`}>
            <RenderElement
              {...t}
              addDate={addDate}
              index={i}
              addToRef={addToRef}
              onKeyDown={handleOnKeyDown}
              onChange={updateNode}
              onFocus={() => handleFocus(i)}
              onPaste={handlePaste}
              store={store}
              isLoading={isLoading}
            />
            {isCommandActive && store.focusedNode === i && (
              <div className="ml-4 h-[0px]">
                <Command
                  extensions={getAvailableExtensions(store.task, extensions)}
                  setter={setter}
                  command={command}
                />
              </div>
            )}
          </div>
        ))}
        {helpers.isTaskEmpty(store) && (
          <p className="text-zinc-400 text-sm pl-6">
            Type anything or press '/' for commands...
          </p>
        )}
      </div>
    </div>
  )
}

// function useAsRef<T>(data: T) {
//   const ref = useRef<T>(data)

//   useLayoutEffect(() => {
//     ref.current = data
//   })

//   return ref
// }
