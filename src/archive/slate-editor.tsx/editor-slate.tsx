import { useCallback, useMemo, useState } from "react"
import { createEditor, type Descendant } from "slate"
import { Editable, Slate, withReact } from "slate-react"

import { getLastChar, linkifyWhenTyping } from "./helpers"
import useEditorConfig from "./useEditorConfig"

export default function EditorSlate({ document, onChange }) {
  const editor = useMemo(() => withReact(createEditor()), [])

  const { renderElement, renderLeaf } = useEditorConfig(editor)

  const initCommand = () => {
    setCommandIsActive(true)
  }
  const onChangeHandler = useCallback(
    (document: Descendant[]) => {
      // checkForCommand(editor, initCommand)
      linkifyWhenTyping(editor)
    },
    [editor]
  )

  const [commandIsActice, setCommandIsActive] = useState(false)

  const handleOnKeyDown = (e) => {
    if (e.key === "/") {
      const lastChar = getLastChar(editor)
      if (lastChar.trim() === "") {
        setCommandIsActive(true)
      }
    }
    if (e.key === "Enter") {
      e.preventDefault()
      //@ts-ignore
      editor.insertNode({ type: "paragraph", children: [{ text: "" }] })
    }
  }

  return (
    <div className="w-full">
      <Slate editor={editor} initialValue={document} onChange={onChangeHandler}>
        <Editable
          placeholder="Type something"
          onKeyDown={handleOnKeyDown}
          className="p-2 border"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  )
}
