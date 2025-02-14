import type { IconType } from "react-icons"

export interface IBookmark {
  name: string
  url: string
  icon: string
}

/**
 * A type representing a node type.
 * "h": Header | "a": Link | "p": text.
 */
export type NodeType = "h" | "a" | "p"

/**
 * A type representing a node.
 * @property {NodeType} type - "h": Header | "a": Link | "p": text.
 * @property {string} value - The text of the node.
 */
export interface INode {
  type: NodeType
  value: string
}

export interface IStoreParams {
  dueDate: number
  tags: string[]
  identities: IIdentity[]
  repeatParams: IRepeatParams | null
}

export interface ITaskParams {
  dueDate: number
  tags: string[]
  identities: IIdentity[]
}

export interface IRecurrence {
  id: string
  nodes: INode[]
  params: IStoreParams
}

export interface ITaskCore {
  id: string
  nodes: INode[]
  params: ITaskParams
  recurrenceId: string
}

export interface IDraft extends ITaskCore {
  dateDrafted: number
}

export interface ITask extends ITaskCore {
  done: boolean
  dateAdded: number
  dateDone: number
}

export interface IStore extends Omit<ITaskCore, "recurrenceId" | "params"> {
  params: IStoreParams
  range: number
  focusedNode: number
}

export interface IExtenstion {
  icon: IconType | (() => Element)
  title: string
  value: any
  action: string
  description: string
  keywords: string[]
}

export interface IIdentity {
  id: number
  label: string
  color: string
  items: {
    key: string
    value: string
  }[]
}

export interface IIncrementor {
  label: string
  goal: number
  value: number
  unit: string
}

export interface IRepeatParams {
  type: "until" | "from"
  goal: number
  step: number
}
