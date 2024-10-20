import { useEffect, useState,useCallback } from "react"

import EditorSlate from "./editor-slate"
import ExampleDocument from "./example-document"

export default function TaskboxSlate() {
  const [document, updateDocument] = useState(ExampleDocument)

  return <EditorSlate document={document} onChange={updateDocument} />
}
