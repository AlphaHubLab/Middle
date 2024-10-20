import type { IconType } from "react-icons"

export interface IBookmark {
  name: string
  url: string
  icon: string
}

export interface IBookmarks {
  [key: string]: Array<IBookmark>
}

export type NodeType = "h" | "a" | "p"

export interface Node {
  type: NodeType
  value: string
}

export interface Store {
  id: string
  task: Node[]
  range: number
  focusedNode: number
  params: { dueDate: number; tags: string[] }
}

export interface Extenstion {
  icon: IconType
  title: string
  value: any
  action: string
  description: string
  keywords: string[]
}
