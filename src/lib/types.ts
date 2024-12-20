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

export interface ITaskParams {
  dueDate: number
  tags: string[]
  identities: IIdentity[]
}

export interface ITaskCore {
  id: string
  nodes: INode[]
  params: ITaskParams
}

export interface IDraft extends ITaskCore {
  dateDrafted: number
}

export interface ITask extends ITaskCore {
  done: boolean
  dateAdded: number
}

export interface IHistory extends ITask {
  dateDone: number
}

export interface IStore extends ITaskCore {
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
