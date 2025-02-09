import uuid4 from "uuid4"

import type {
  IExtenstion,
  INode,
  IReference,
  IStore,
  IStoreParams,
  ITaskCore,
  ITaskParams,
  NodeType
} from "./types"

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

const onlyUrlRegex =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi

export const isUrlByRegex = (str: string) => str.match(onlyUrlRegex)
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

  if (isUrlByRegex(_newValue)) return "a"

  return "p"
}

/**
 *
 * @param store
 */
export const getLabels = (taskCore: ITaskCore | IStore) => {
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
export const createEmptyStore = () =>
  ({
    id: uuid4(),
    nodes: [
      { type: "h", value: "" },
      { type: "p", value: "" }
    ],
    range: 0,
    focusedNode: 0,
    params: getStoreDefaultParams()
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
  const usedIdentitesID = store.params.identities.map((i) => i.id)

  return extensions.filter((ext) => {
    if (ext.action !== "addIdentity") {
      return true
    } else {
      return !usedIdentitesID.includes(ext.value.id)
    }
  })
}

/**
 * Convert persisted single task/draft to editable store
 */
export const convertToStore = ({
  id,
  nodes,
  params
}: {
  id: string
  nodes: INode[]
  params: ITaskParams | IStoreParams
}): IStore => {
  // If task has just one node, We add a single empty node
  // to the end of the noes for a better user experience.
  const _nodes = [...nodes]

  if (_nodes.length === 1) _nodes.push({ type: "p", value: "" })

  return {
    id: id,
    nodes: _nodes,
    params: {
      ...params,
      repeatParams: params.hasOwnProperty("repeatParams")
        ? (params as IStoreParams).repeatParams // if edit reference/draft
        : null // if task edit
    },
    focusedNode: nodes.length - 1,
    range: nodes[nodes.length - 1].value.length
  }
}

export const convertReferenceToStore = (reference: IReference): IStore => {
  // If task has just one node, We add a single empty node
  // to the end of the noes for a better user experience.
  const _nodes = [...reference.nodes]

  if (_nodes.length === 1) _nodes.push({ type: "p", value: "" })

  return {
    id: reference.id,
    nodes: _nodes,
    params: reference.params,
    focusedNode: 0,
    range: 0
  }
}

/**
 * Return the first node that has a value
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
export const getUpcomingPreview = (nodes: INode[], limit = 25): INode => {
  if (nodes[0].value.length > 0) {
    return {
      type: "h",
      value: strShortener(nodes[0].value, limit)
    }
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

/**
 *
 * @param str
 * @param limit
 * @returns
 */
const strShortener = (str: string, limit: number) => {
  return str.length > limit ? str.slice(0, limit).trim() + "..." : str
}

/**
 *
 */
export const getTaskDefaultParams = (): ITaskParams => ({
  dueDate: -1,
  tags: [],
  identities: []
})

/**
 *
 */
export const getStoreDefaultParams = (): IStoreParams => ({
  dueDate: -1,
  tags: [],
  identities: [],
  repeatParams: null
})

/**
 * Get the preview nodes of a task
 */
export const getPreviewNodes = (item: ITaskCore, references: IReference[]) => {
  const nodes =
    item.reference.length === 0
      ? item.nodes
      : references.find((r) => r.id === item.reference).nodes

  return nodes
}
