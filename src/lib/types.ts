import type { IconType } from "react-icons"

export interface IBookmark {
  name: string
  url: string
  icon: string
}

export interface IBookmarks {
  [key: string]: Array<IBookmark>
}

export interface Extenstion {
  icon: IconType
  title: string
  value: string
  keywords: Array<string>
}
