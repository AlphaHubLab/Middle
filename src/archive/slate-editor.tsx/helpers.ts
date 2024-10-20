import isUrl from "is-url"
import { Editor, Point, Range, Text, Transforms, type BaseEditor } from "slate"
import { type ReactEditor } from "slate-react"

export function getLastChar(editor: BaseEditor & ReactEditor) {
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return
  }
  const [node, _] = Editor.parent(editor, editor.selection)
  // return early
  // @ts-ignore
  if (node.type === "link") return
  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection)
  // @ts-ignore
  if (currentNode.code) return
  if (!Text.isText(currentNode)) return

  let [start] = Range.edges(editor.selection)
  const cursorPoint = start

  let startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character"
  })

  let lastCharacter: string

  if (
    currentNodePath[0] === 0 &&
    currentNodePath[1] === 0 &&
    cursorPoint.offset === 0
  ) {
    startPointOfLastCharacter = cursorPoint
    lastCharacter = ""
  } else {
    lastCharacter = Editor.string(
      editor,
      Editor.range(editor, startPointOfLastCharacter, cursorPoint)
    )
  }

  return lastCharacter
}

export function linkifyWhenTyping(editor: BaseEditor & ReactEditor) {
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return
  }
  const [node, _] = Editor.parent(editor, editor.selection)
  // return early
  // @ts-ignore
  if (node.type === "link") return
  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection)
  // @ts-ignore
  if (currentNode.code) return
  if (!Text.isText(currentNode)) return

  let [start] = Range.edges(editor.selection)
  const cursorPoint = start

  let startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character"
  })

  let lastCharacter: string

  if (
    currentNodePath[0] === 0 &&
    currentNodePath[1] === 0 &&
    cursorPoint.offset === 0
  ) {
    startPointOfLastCharacter = cursorPoint
    lastCharacter = ""
  } else {
    lastCharacter = Editor.string(
      editor,
      Editor.range(editor, startPointOfLastCharacter, cursorPoint)
    )
  }

  if (lastCharacter !== " ") return

  let end = startPointOfLastCharacter

  start = Editor.before(editor, end, {
    unit: "character"
  })

  // If we are in very first position, Editor.before is undifined
  if (!start) return

  const startOfTextNode = Editor.point(editor, currentNodePath, {
    edge: "start"
  })

  while (
    Editor.string(editor, Editor.range(editor, start, end)) !== " " &&
    !Point.isBefore(start, startOfTextNode)
  ) {
    end = start

    if (start.offset === 0 && start.path[0] === 0 && start.path[1] === 0) {
      break
    }

    start = Editor.before(editor, end, { unit: "character" })
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter)

  const lastWord = Editor.string(editor, lastWordRange)

  if (isUrl(lastWord)) {
    Promise.resolve().then(() => {
      Transforms.wrapNodes(
        editor,
        //@ts-ignore
        { type: "link", url: lastWord, children: [{ text: lastWord }] },
        { split: true, at: lastWordRange }
      )
    })
  }
}
