import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"

import ButtonFetch from "~components/ui/button-fetch"
import { useAppState } from "~contexts/app-context"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { useSettingContext } from "~contexts/setting-context"
import * as helpers from "~lib/task-helpers"
import type {
  IExtenstion,
  IIdentity,
  INode,
  IStore,
  NodeType
} from "~lib/types"

import { Command } from "./commands"
import { createIdentityExtenstions, GENERAL_EXTENTIONS } from "./extenstions"
import { RenderElement } from "./render-element"

type HTMLInputs = HTMLInputElement | HTMLTextAreaElement

const tagRegExp = new RegExp(/\B(?<!\!|\#|\_)\#\w*[a-zA-Z_]+\w*/g)

export default function Editor({ disabled }) {
  const { openEditMode, initialStore, editorType } = useAppState()
  const { handlePersist } = usePersistContext()
  const { setDrafts } = useDraftContext()
  const { setting } = useSettingContext()

  const [store, setStore] = useState<IStore>(initialStore)
  const [isCommandActive, setIsCommandActive] = useState(false)
  const [command, setCommand] = useState("")

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
        focusedNode: store.focusedNode - 1,
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

  // Task params
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

  const modifyDate = (dueDate: number) => {
    const params = { ...store.params, dueDate }
    const newStore = {
      ...store,
      params
    }

    updateHistory(store)
    setStore(newStore)
  }

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

  const addIdentity = (identity: IIdentity) => {
    const identities = [...store.params.identities]

    // Prevent to add duplicate
    if (identities.find((existed) => existed.id === identity.id)) return

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

      case "persist":
        persistTask()
        break

      case "addIdentity":
        addIdentity(_extension.value)
        break
    }
  }

  const newTask = () => {
    openEditMode(helpers.createInitialStore(), "new")
    setCommand("")
    setIsCommandActive(false)
  }

  const deleteDraft = () => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== store.id))
    newTask()
  }

  const persistTask = () => {
    // should re evaluate tags
    handlePersist(store)
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

      // When move caret before initializer slash
      else if (e.key === "ArrowLeft") {
        if (e.target.selectionStart === cmdStartPos.current + 1) {
          setIsCommandActive(false)
        }
      }

      // When move caret after command word boundary
      else if (e.key === "ArrowRight") {
        if (e.target.selectionStart > cmdStartPos.current + command.length) {
          setIsCommandActive(false)
        }
      }
    }
  }

  return (
    <div className="w-full">
      <div
        role="toolbar"
        className={`${!disabled ? "visible opacity-100" : "invisible opacity-0"}
                    text-sm items-center flex gap-2 pl-4 sticky top-0 bg-white h-12 transition-all duration-200`}>
        <>
          <ButtonFetch
            variant="primary"
            disabled={disabled}
            onClick={persistTask}>
            {editorType === "new" || editorType === "draft"
              ? "Store"
              : "Save Changes"}
          </ButtonFetch>
          <ButtonFetch
            variant="primary"
            // className="border p-1 rounded-md border-zinc-500 text-zinc-500 hover:text-rose-300"
            disabled={disabled || helpers.isTaskEmpty(store, "loose")}
            onClick={deleteDraft}>
            {editorType === "new" || editorType === "draft"
              ? "Discard"
              : "Discard Changes"}
          </ButtonFetch>
          <ButtonFetch
            variant="primary"
            // className="border p-1 rounded-md border-zinc-500 text-zinc-500 hover:text-rose-300"
            onClick={newTask}>
            + new
          </ButtonFetch>
        </>
      </div>

      <div>
        {store.nodes.map((n, i) => (
          <div className="flex flex-col" key={`textarea-${i}`}>
            <RenderElement
              {...n}
              addDate={modifyDate}
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
                  extensions={helpers.getAvailableExtensions(store, extensions)}
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
