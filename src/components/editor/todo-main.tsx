// import DraftProvider from "~contexts/draft-context"

import { usePersistContext } from "~contexts/persisting-context"

import Editor from "./editor"

export default function TodoMainSlash({ disabled }) {
  const { handlePersist } = usePersistContext()
  return <Editor disabled={disabled} handlePersist={handlePersist} />
}
