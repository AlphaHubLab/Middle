import { useApp } from "providers/app-context"
import { useDraft } from "providers/draft-context"
import { usePersist } from "providers/persist-context"
import { useSetting } from "providers/setting-context"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"
import { PiFloppyDisk, PiTrash } from "react-icons/pi"

import useDebouncedDraft from "~hooks/useDebouncedDraft"
import * as helpers from "~lib/task-helpers"
import { getAvailableExtensions } from "~lib/task-helpers"
import type {
  IExtenstion,
  IIdentity,
  INode,
  IRepeatParams,
  IStore,
  IStoreParams,
  NodeType
} from "~lib/types"

import { RenderElement } from "../renderables/render-element"
import { DraftStatus } from "../renderables/status"
import { Command } from "./commands"
import { createIdentityExtenstions, GENERAL_EXTENTIONS } from "./extenstions"

type HTMLInputs = HTMLInputElement | HTMLTextAreaElement

const tagRegExp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z_]+\w*/g)
// const projectRegExp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z0-9_]+\w*/g)

export default function Editor({ disabled }) {
  const { initialStore, editorType, setEditMode, newEditor } = useApp()

  const { handlePersist, handlePersistByRecurrence } = usePersist()
  const { drafts, setDrafts } = useDraft()
  const { setting } = useSetting()

  const [store, setStore] = useState(initialStore)
  const [isCommandActive, setIsCommandActive] = useState(false)
  const [command, setCommand] = useState("")

  const { isLoading } = useDebouncedDraft(store, editorType !== "task")

  const nodes = useRef<HTMLInputs[]>([])
  const undos = useRef<IStore[]>([])
  const redos = useRef<IStore[]>([])
  const cmdStartPos = useRef(0)
  const nodeSnapshot = useRef("")

  nodes.current = []

  const extensions = useMemo<IExtenstion[]>(() => {
    const identityExtensions = createIdentityExtenstions(setting.identities)
    return [...GENERAL_EXTENTIONS, ...identityExtensions]
  }, [setting])

  const addToRef = (el: HTMLInputs) => {
    if (el && !nodes.current.includes(el)) nodes.current.push(el)
  }

  /** Effects */
  useEffect(() => setStore(initialStore), [initialStore])

  // Clear Editor when working draft deleted using list
  useEffect(() => {
    if (!drafts.find((draft) => draft.id === store.id)) {
      newEditor(false)
    }
  }, [drafts.length])

  // Deactivate command onclick outsite
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
  }, [store.range, store.nodes])

  // Preventing inputs to be blured between rerenders
  useEffect(() => {
    if (disabled) return // Preventing focus() on disabled state
    nodes?.current[store.focusedNode].focus()
  }, [store.nodes, store.focusedNode])

  // focus on Title if task is empty
  // otherwise focus on the stored focusedNodde
  useEffect(() => {
    if (disabled) return

    if (helpers.isTaskEmpty(store, "loose")) {
      nodes?.current[0].focus()
    } else {
      nodes?.current[store.focusedNode].focus()
    }
  }, [disabled])

  // Handle tags
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

  const updateHistory = (store: IStore) => {
    if (undos.current.length > 15) undos.current.shift()
    if (redos.current.length > 0) redos.current = []

    undos.current.push(store)
  }

  const initCommand = (e: ChangeEvent<HTMLInputs>) => {
    setIsCommandActive(true)
    setCommand("")

    cmdStartPos.current = e.target.selectionStart
    nodeSnapshot.current = store.nodes[store.focusedNode].value
  }

  const updateCommand = (e: ChangeEvent<HTMLInputs>) => {
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
      range: store.nodes[store.focusedNode - 1].value.length,
      focusedNode: store.focusedNode - 1
    })
  }

  const nextNode = (e: KeyboardEvent) => {
    e.preventDefault()

    if (store.focusedNode === store.nodes.length - 1) return

    setStore({ ...store, focusedNode: store.focusedNode + 1 })
  }

  /** Node functions */
  const addNode = (type: NodeType, value = "") => {
    // 'h' can not be added twice
    if (type === "h") {
      if (helpers.hasTitle(store)) return

      const newStore = {
        ...store,
        nodes: [{ type, value }, ...store.nodes],
        focusedNode: 0,
        range: 0
      }

      updateHistory(store)
      setStore(newStore)
    } else {
      const newStore = {
        ...store,
        range: -1,
        focusedNode: store.focusedNode + 1,
        nodes: store.nodes.toSpliced(store.focusedNode + 1, 0, {
          type,
          value: ""
        })
      }

      updateHistory(store)
      setStore(newStore)
    }
  }

  const replaceNodes = (nodes: INode[], range = null) => {
    const newStore = {
      ...store,
      nodes: store.nodes.toSpliced(store.focusedNode, 1, ...nodes),
      range: range ? range : 0,
      focusedNode: store.focusedNode + nodes.length - 1
    }

    updateHistory(store)
    setStore(newStore)
  }

  const updateNode = (e: ChangeEvent<HTMLInputs>) => {
    if (isCommandActive) updateCommand(e)

    // Shallow copy also works,
    // but cannot use debounce drafting and may produces some bugs
    // const nodes = [...store.nodes]

    const nodes = structuredClone(store.nodes)

    nodes[store.focusedNode].value = e.target.value

    const newStore = { ...store, nodes, range: -1 }

    setStore(newStore)
  }

  const splitNode = (e: ChangeEvent<HTMLInputs>) => {
    const node = store.nodes[store.focusedNode]

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

    const p1 = store.nodes[store.focusedNode - 1].value
    const p2 = store.nodes[store.focusedNode].value

    const mergedValue = p1 + p2

    const type = helpers.getNodeType(
      store.nodes[store.focusedNode - 1],
      mergedValue
    )

    const mergedNode = { type, value: mergedValue }

    const newStore = {
      ...store,
      nodes: store.nodes.toSpliced(store.focusedNode - 1, 2, mergedNode),
      range: p1.length,
      focusedNode: store.focusedNode - 1
    }

    updateHistory(store)
    setStore(newStore)
  }

  /** Task Params */
  /** Tags */
  const addTags = () => {
    const _tags = []

    store.nodes.forEach((t) => {
      if (t.type !== "a") {
        const nodeTags = t.value.match(tagRegExp)
        if (nodeTags && nodeTags.length > 0) _tags.push(...nodeTags)
      }
    })

    const newTags = Array.from(new Set(_tags.map((t) => t.toLowerCase())))

    const params = { ...store.params, tags: newTags }

    setStore({ ...store, params })
  }

  /** DueDate */
  const addDate = (dueDate: number) => {
    const params = { ...store.params, dueDate }

    const newStore = {
      ...store,
      nodes: store.nodes.toSpliced(store.focusedNode, 1, {
        type: store.nodes[store.focusedNode].type as NodeType,
        value: nodeSnapshot.current
      }),
      range: nodeSnapshot.current.length,
      focusedNode: store.focusedNode,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  const modifyDate = (dueDate: number) => {
    const params = { ...store.params, dueDate }

    const newStore = {
      ...store,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  /** Identity */
  const addIdentity = (identity: IIdentity) => {
    // Prevent to add duplicate
    if (store.params.identities.find((idn) => idn.id === identity.id)) {
      const newStore = {
        ...store,
        nodes: store.nodes.toSpliced(store.focusedNode, 1, {
          type: store.nodes[store.focusedNode].type as NodeType,
          value: nodeSnapshot.current
        }),
        range: nodeSnapshot.current.length,
        focusedNode: store.focusedNode
      }

      updateHistory(store)
      setStore(newStore)
      return
    }

    const identities = [...store.params.identities]

    identities.push(identity)

    const params = { ...store.params, identities }

    const newStore = {
      ...store,
      nodes: store.nodes.toSpliced(store.focusedNode, 1, {
        type: store.nodes[store.focusedNode].type as NodeType,
        value: nodeSnapshot.current
      }),
      range: nodeSnapshot.current.length,
      focusedNode: store.focusedNode,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  const removeIdentity = (id: number) => {
    let identities = [...store.params.identities]
    identities = identities.filter((identity) => identity.id !== id)

    const params = { ...store.params, identities }

    const newStore = { ...store, params }

    updateHistory(store)
    setStore(newStore)
  }

  /** Repeater */
  const addRepeat = (repeatParams: IRepeatParams) => {
    let params: IStoreParams

    if (store.params.dueDate === -1) {
      // Add dueDate if not added before
      params = { ...store.params, repeatParams, dueDate: new Date().getTime() }
    } else {
      params = { ...store.params, repeatParams }
    }

    const newStore = {
      ...store,
      nodes: store.nodes.toSpliced(store.focusedNode, 1, {
        type: store.nodes[store.focusedNode].type as NodeType,
        value: nodeSnapshot.current
      }),
      range: nodeSnapshot.current.length,
      focusedNode: store.focusedNode,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  const modifyRepeat = (repeatParams: IRepeatParams) => {
    const params = { ...store.params, repeatParams }

    const newStore = {
      ...store,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

  /** Incrementor */
  // const addIncrementor = (incrementor: IIncrementor) => {
  //   const incrementors = [...store.params.incrementors]

  //   incrementors.push(incrementor)

  //   const params = { ...store.params, incrementors }

  //   const newStore = {
  //     ...store,
  //     nodes: store.nodes.toSpliced(store.focusedNode, 1, {
  //       type: store.nodes[store.focusedNode].type as NodeType,
  //       value: nodeSnapshot.current
  //     }),
  //     range: nodeSnapshot.current.length,
  //     focusedNode: store.focusedNode,
  //     params
  //   }

  //   updateHistory(store)
  //   setStore(newStore)
  // }

  // const modifyIncrementor = (index: number, incrementor: IIncrementor) => {
  //   const incrementors = structuredClone(store.params.incrementors)
  //   incrementors[index] = incrementor

  //   const params = { ...store.params, incrementors }
  //   const newStore = { ...store, params }

  //   updateHistory(store)
  //   setStore(newStore)
  // }

  // const removeIncrementor = (index: number) => {
  //   const incrementors = structuredClone(store.params.incrementors)
  //   incrementors.splice(index, 1)

  //   const params = { ...store.params, incrementors }
  //   const newStore = { ...store, params }

  //   updateHistory(store)
  //   setStore(newStore)
  // }

  /** Setter */
  const setter = (_extension: any) => {
    setIsCommandActive(false)

    switch (_extension.action) {
      case "replaceNode":
        // Replace current node if it is empty and not a title
        if (
          store.nodes[store.focusedNode].value.trim() === `/${command}` &&
          store.nodes[store.focusedNode].type !== "h"
        ) {
          replaceNodes([{ type: _extension.value, value: "" }])
          break
        }

        // Add a new node if current node has text or is title
        const newNode = { type: _extension.value, value: "" }

        const currentNode = {
          type: store.nodes[store.focusedNode].type,
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

      case "addIdentity":
        addIdentity(_extension.value)
        break

      case "addRepeat":
        addRepeat(_extension.value)
        break
    }
  }

  const newTask = () => {
    newEditor()
    setCommand("")
    setIsCommandActive(false)
  }

  const deleteDraft = () => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== store.id))
    newTask()
  }

  const persistTask = async () => {
    addTags()
    if (editorType === "recurrence") {
      await handlePersistByRecurrence(store)
    } else {
      await handlePersist(store)
    }

    deleteDraft()
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
    e: ChangeEvent<HTMLInputs> & KeyboardEvent<HTMLInputs>
  ) => {
    const prevChar = e.target.value.charAt(e.target.selectionStart - 1).trim()

    // cmd | ctrl + Enter to save task
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      return persistTask()
    }

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

      // If Caret pos === 0 => Delete the node or Merge with previous one
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
          e.target.selectionStart ===
          store.nodes[store.focusedNode].value.length
        ) {
          return nextNode(e)
        }
      }
    }

    if (isCommandActive) {
      // Handled by <Command> Component
      if (e.key === "Enter") {
        e.preventDefault()
      }

      // Command exited with "Space"
      else if (e.key === " " || e.key === "Space" || e.key === "/") {
        return setIsCommandActive(false)
      }

      // When caret moves before initializer slash
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === cmdStartPos.current + 1) {
          setIsCommandActive(false)
        }
      }

      // When caret moves after command word boundary
      else if (e.key === "ArrowRight") {
        if (e.target.selectionStart > cmdStartPos.current + command.length) {
          setIsCommandActive(false)
        }
      }
    }
  }

  // const handleClickOnEmptyEditor = () => {
  //   if (store.nodes.length === 1) {
  //     addNode("p")
  //     return
  //   } else if (store.nodes.length === 2 && store.nodes[1].value.trim() === "") {
  //     setStore({
  //       ...store,
  //       focusedNode: 1
  //     })
  //   } else {
  //     setStore({
  //       ...store,
  //       focusedNode: store.nodes.length - 1
  //     })
  //   }
  // }

  return (
    <div
      className="w-full h-full"
      // onClick={handleClickOnEmptyEditor}
    >
      <div>
        <div
          className={`${!disabled ? "visible opacity-100" : "invisible opacity-0"} items-center flex gap-2 pl-4 sticky top-0 rounded-lg py-2 transition-all duration-200`}>
          <div
            className="flex gap-2 flex-auto"
            role="toolbar"
            aria-orientation="horizontal">
            <button
              className="disabled:bg-zinc-300 bg-fetch-primary text-white hover:bg-violet-500 duration-200 rounded-md px-1 py-[2px] flex items-center justify-center"
              disabled={disabled || helpers.isTaskEmpty(store, "loose")}
              onClick={persistTask}>
              <span className="flex gap-2 items-center">
                <span className="text-lg sm:text-sm">
                  <PiFloppyDisk />
                </span>
                <span className="hidden sm:block text-xs">
                  {editorType === "new" || editorType === "draft"
                    ? "Store"
                    : "Save Changes"}
                </span>
              </span>
            </button>
            <button
              className="disabled:text-zinc-300 disabled:border-zinc-300 text-rose-500 hover:text-rose-400 hover:border-rose-400 border duration-200 rounded-md px-1 py-[2px] text-xs flex items-center justify-center"
              disabled={disabled || helpers.isTaskEmpty(store, "loose")}
              onClick={editorType === "new" ? deleteDraft : newTask}>
              <span className="flex gap-2 items-center">
                <span className="text-lg sm:text-sm">
                  <PiTrash />
                </span>
                <span className="hidden sm:block text-xs">
                  {editorType === "new" || editorType === "draft"
                    ? "Delete Draft"
                    : "Cancel"}
                </span>
              </span>
            </button>
            <button
              className="border hover:bg-fetch-secondary duration-200 rounded-md px-1 py-[2px] text-xs flex items-center justify-center"
              onClick={newTask}>
              +new
            </button>
            <button
              className="border rounded-md hover:bg-fetch-secondary duration-200 px-1 py-[2px] text-xs flex items-center justify-center"
              onClick={() => setEditMode(false)}>
              Not Now
            </button>
          </div>
          <DraftStatus
            isLoading={isLoading}
            isTaskEmpty={helpers.isTaskEmpty(store, "loose")}
          />
        </div>
      </div>

      <div>
        {store.nodes.map((n, i) => (
          <div className="flex flex-col" key={`textarea-${i}`}>
            <RenderElement
              {...n}
              modifyDate={modifyDate}
              modifyRepeat={modifyRepeat}
              removeIdentity={removeIdentity}
              index={i}
              addToRef={addToRef}
              onKeyDown={handleOnKeyDown}
              onChange={updateNode}
              onFocus={() => handleFocus(i)}
              onPaste={handlePaste}
              store={store}
            />
            {isCommandActive && store.focusedNode === i && (
              <div className="ml-4 h-[0px]">
                <Command
                  extensions={getAvailableExtensions(store, extensions)}
                  setter={setter}
                  command={command}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
