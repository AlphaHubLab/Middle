import uuid4 from "uuid4"

import type { Extenstion, Node, NodeType, Store } from "./types"

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

const onlyUrlRegex = new RegExp(
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi
)
/**
 *
 * @param store
 * @param type
 * @returns
 */
export const isTaskEmpty = (store: Store, type = "strict") => {
  if (type === "strict") {
    return (
      store.task.length === 1 &&
      store.task[0].value === "" &&
      store.params.dueDate === -1 &&
      store.params.tags.length === 0
    )
  }

  if (type === "loose") {
    return store.task.every((n) => n.value.length === 0)
  }
}

/**
 *
 * @param store
 */
export const hasTitle = (store: Store) => store.task[0].type === "h"

/**
 *
 * @param e
 * @param store
 */
export const splitTextByUrls = (e: ClipboardEvent, store: Store) => {
  const current =
    store.task[store.focusedNode].value + e.clipboardData.getData("Text").trim()

  const splittedByLine = current.trim().split(/\n/)
  const urls: string[] = current.match(urlRegex) || []

  const nodes: Node[] = []
  const splittedBySpace: string[][] = []

  splittedByLine.forEach((s) => splittedBySpace.push(s.split(" ")))

  for (let i = 0; i < splittedBySpace.length; i++) {
    if (splittedBySpace[i][0] === "") {
      nodes.push({ type: "p", value: "" })
      continue
    }

    let str = ""

    for (let j = 0; j < splittedBySpace[i].length; j++) {
      const isUrl = urls.includes(splittedBySpace[i][j])
      if (isUrl === false) {
        str = str + " " + splittedBySpace[i][j]
        if (j === splittedBySpace[i].length - 1) {
          const trimmed = str.trim()

          if (trimmed.length > 0) {
            nodes.push({ type: "p", value: trimmed })
          }
        }
      } else {
        const trimmed = str.trim()

        if (trimmed.length > 0) {
          nodes.push({ type: "p", value: trimmed })
        }

        str = ""
        nodes.push({ type: "a", value: splittedBySpace[i][j] })
      }
    }
  }

  if (store.focusedNode === 0) nodes[0].type = "h"

  return nodes
}

/**
 *
 * @param _node
 * @param _addedValue
 */
export const getNodeType = (_node: Node, _newValue = null): NodeType => {
  _newValue = typeof _newValue === "string" ? _newValue : _node.value
  if (_node.type === "h") return "h"
  if (_newValue.match(onlyUrlRegex)) return "a"
  return "p"
}

/**
 *
 * @param store
 */
export const getLabels = (store: Store) => {
  const labels = []
  if (store.task.find((n) => n.type === "a")) labels.push("link")
  if (store.params.dueDate !== -1) labels.push("date")
  if (store.params.tags.length > 0) labels.push("tag")
  return labels
}

/**
 * Create and return an Empty new task template with UUID
 */
export const getInitialStore = () =>
  ({
    id: uuid4(),
    task: [{ type: "h", value: "" }],
    range: 0,
    focusedNode: 0,
    params: { dueDate: -1, tags: [] }
  }) as Store

/**
 *
 * @param store
 * @param extensions
 * @returns
 */
export const getAvailableExtensions = (
  store: Store,
  extensions: Extenstion[]
) => {
  // Remove Title if There is one
  return hasTitle(store)
    ? extensions.filter((ex) => ex.value !== "h")
    : extensions
}
