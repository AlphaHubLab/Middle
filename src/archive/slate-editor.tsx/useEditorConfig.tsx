import type { BaseEditor } from "slate"
import { DefaultElement } from "slate-react"
import type { ReactEditor } from "slate-react"

import Link from "./link"

export default function useEditorConfig(editor: BaseEditor & ReactEditor) {
  //@ts-ignore
  editor.isInline = (element) => (element.type === "link" ? true : false)
  return { renderElement, renderLeaf }
}

function renderElement(props) {
  const { element, children, attributes } = props
  switch (element.type) {
    case "paragraph":
      return <p {...attributes} placeholder="Keep typing..." className="placeholders">{children}</p>
    case "h1":
      return <h1 {...attributes} className="font-bold">{children}</h1>
    case "link":
      return <Link {...props} url={element.url} />
    default:
      return <DefaultElement {...props} />
  }
}

function renderLeaf({ attributes, children, leaf }) {
  let el = <>{children}</>

  if (leaf.code) {
    el = <code>{el}</code>
  }

  // if (leaf.bold) {
  //   el = <strong>{el}</strong>
  // }
  // if (leaf.italic) {
  //   el = <em>{el}</em>
  // }

  // if (leaf.underline) {
  //   el = <u>{el}</u>
  // }

  return <span {...attributes}>{el}</span>
}
