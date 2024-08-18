export interface IBookmark {
  name: string
  url: string
  icon: string
}

export interface IBookmarks {
  [key: string]: Array<IBookmark>
}
