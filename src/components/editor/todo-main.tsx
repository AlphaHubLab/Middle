import React from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Editor from "./editor"

export default function TodoMainSlash({ disabled, setStorage }) {
  const [drafts, setDrafts, { isLoading: storageLoading }] = useStorage(
    {
      key: "middle-drafts",
      instance: new Storage({
        area: "local"
      })
    },
    (v: Array<any>) => (!v ? [] : v)
  )

  return (
    <Editor
      disabled={disabled}
      drafts={drafts}
      setDrafts={setDrafts}
      setStorage={setStorage}
      storageLoading={storageLoading}
    />
  )
}
