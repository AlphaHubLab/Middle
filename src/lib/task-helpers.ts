import uuid4 from "uuid4"

import type {
  IDraft,
  IExtenstion,
  INode,
  IStore,
  ITaskCore,
  ITaskParams,
  NodeType
} from "./types"

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
export const isTaskEmpty = (store: IStore, type = "strict") => {
  if (type === "strict") {
    return (
      store.nodes.length === 1 &&
      store.nodes[0].value === "" &&
      store.params.dueDate === -1 &&
      store.params.tags.length === 0
    )
  }

  if (type === "medium") {
    return (
      store.nodes.every((n) => n.value.length === 0) &&
      store.params.dueDate === -1 &&
      store.params.tags.length === 0
    )
  }

  if (type === "loose") {
    return (
      store.nodes.every((n) => n.value.trim().length === 0) &&
      store.params.dueDate === -1 &&
      store.params.tags.length === 0
    )
  }
}

/**
 *
 * @param store
 */
export const hasTitle = (store: IStore) => store.nodes[0].type === "h"

/**
 *
 * @param e
 * @param store
 */
export const splitTextByUrls = (e: ClipboardEvent, store: IStore) => {
  const current =
    store.nodes[store.focusedNode].value +
    e.clipboardData.getData("Text").trim()

  const splittedByLine = current.trim().split(/\n/)
  const urls: string[] = current.match(urlRegex) || []

  const nodes: INode[] = []
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
export const getNodeType = (_node: INode, _newValue = null): NodeType => {
  _newValue = typeof _newValue === "string" ? _newValue : _node.value
  if (_node.type === "h") return "h"
  if (_newValue.match(onlyUrlRegex)) return "a"
  return "p"
}

/**
 *
 * @param store
 */
export const getLabels = (taskCore: ITaskCore) => {
  const { nodes, params } = taskCore
  const labels = { date: false, link: false, tag: false }
  if (params.dueDate !== -1) labels.date = true
  if (nodes.find((n) => n.type === "a")) labels.link = true
  if (params.tags.length > 0) labels.tag = true
  return labels
}

/**
 * Create and return an Empty new task template with UUID
 */
export const createInitialStore = () =>
  ({
    id: uuid4(),
    nodes: [
      { type: "h", value: "" },
      { type: "p", value: "" }
    ],
    range: 0,
    focusedNode: 0,
    params: { dueDate: -1, tags: [], identities: [] }
  }) as IStore

/**
 *
 * @param store
 * @param extensions
 * @returns
 */
export const getAvailableExtensions = (
  store: IStore,
  extensions: IExtenstion[]
) => {
  // Remove Title if There is one
  return hasTitle(store)
    ? extensions.filter((ex) => ex.value !== "h")
    : extensions
}

// export const convertToTask = (store): ITask => {
//   return    {   id: store.id,
//   nodes: store.nodes,
//   params: store.params,
//   done: false,
//   dateAdded, 
//   dateDone: -1
// }
// }
export const convertToStore = ({ id, nodes, params }: ITaskCore): IStore => {
  return {
    id: id,
    nodes: [...nodes],
    params: { ...params },
    focusedNode: nodes.length - 1,
    range: nodes[nodes.length - 1].value.length
  }
}

/**
 * Return the first node that has a value
 * @param nodes
 */
export const getFirstNonEmptyNode = (nodes: INode[]) => {
  const len = nodes.length

  for (let i = 1; i < len; i++) {
    if (nodes[i].value.length > 0) return nodes[i]
  }

  return null
}

/**
 * Create a preview node for upcomming list.
 * @param nodes
 * @param limit The number of showable characters
 */
export const getUpcommingPreview = (nodes: INode[], limit = 25): INode => {
  if (nodes[0].value.length > 0) {
    return { type: "h", value: strShortener(nodes[0].value, limit) }
  }

  const nonEmptyNode = getFirstNonEmptyNode(nodes)
  if (nonEmptyNode) {
    return { type: "p", value: strShortener(nonEmptyNode.value, limit) }
  }

  return { type: "p", value: "[empty]" }
}

/**
 * Create a 2-nodes length preview for more detailed preview.
 * @param nodes
 * @param limit The number of showable characters
 */
export const getDetailedPreview = (nodes: INode[], limit = 25): INode[] => {
  const preview = []

  // Handle the title
  if (nodes[0].value.length > 0) {
    preview.push({ type: "h", value: strShortener(nodes[0].value, limit) })
  } else {
    preview.push({ type: "h", value: "[no title]" })
  }

  // Handle second node
  const nonEmptyNode = getFirstNonEmptyNode(nodes)

  if (nonEmptyNode) {
    preview.push({ type: "p", value: strShortener(nonEmptyNode.value, limit) })
  } else {
    preview.push({ type: "p", value: "[empty]" })
  }

  return preview
}

const strShortener = (str: string, limit: number) => {
  return str.length > limit ? str.slice(0, limit).trim() + "..." : str
}
