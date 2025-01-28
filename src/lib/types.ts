import type { IconType } from "react-icons"

export interface IBookmark {
  name: string
  url: string
  icon: string
}

export type IBookmarks = Record<string, IBookmark[]>

export type NodeType = "h" | "a" | "p"

export interface INode {
  type: NodeType
  value: string
}

export interface IStoreParams {
  dueDate: number
  tags: string[]
  identities: IIdentity[]
  repeatParams: IRepeatParams | null
  // todo on next version
  // incrementors: IIncrementor[]
}

export interface ITaskParams {
  dueDate: number
  tags: string[]
  identities: IIdentity[]
  // todo on next version
  // incrementors: IIncrementor[]
}

export interface IReference {
  id: string
  nodes: INode[]
  params: IStoreParams
}

export interface ITaskCore {
  id: string
  nodes: INode[]
  params: ITaskParams
  reference: string
}

export interface IDraft extends ITaskCore {
  dateDrafted: number
}

export interface ITask extends ITaskCore {
  done: boolean
  dateAdded: number
  dateDone: number
}

export interface IStore extends Omit<ITaskCore, "reference" | "params"> {
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
