import type { ChangeEvent, ClipboardEventHandler } from "react"
import uuid4 from "uuid4"

import type { Node, NodeType, Store } from "./types"

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

const onlyUrlRegex = new RegExp(
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi
)
/**
 *
 * @param store
 * @returns
 */
export const isTaskEmpty = (store: Store) =>
  store.task.length === 1 &&
  store.task[0].value === "" &&
  store.params.dueDate === -1 &&
  store.params.tags.length === 0
// _task.every((n) => n.value.length === 0)

/**
 *
 * @param _task
 */
export const hasTitle = (_task) => _task[0].type === "h"

/**
 *
 * @param e
 * @param _task
 * @param focusedNodezR
 * @param createTitle
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

  if (isTaskEmpty(store) && hasTitle(store.task)) nodes[0].type = "h"

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
 * @param _nodes
 * @param _taskParams
 * @returns
 */
export const getLabels = (store: Store) => {
  const labels = []
  if (store.task.find((n) => n.type === "a")) labels.push("a")
  if (store.params.dueDate !== -1) labels.push("date")
  return labels
}

/**
 *
 * @returns
 */
export const getInitialStore = () =>
  ({
    id: uuid4(),
    task: [{ type: "h", value: "" }],
    range: 0,
    focusedNode: 0,
    params: { dueDate: -1, tags: [] }
  }) as Store
