// import { Storage } from "@plasmohq/storage"
// import { useStorage } from "@plasmohq/storage/hook"

import FormLikeEditorSlash from "./form-like-editor-slash"
import FormLikeEditorSlashWithStore from "./form-like-editor-slash-with-store"

// import { RenderElementReadOnly } from "./render-element-readonly"

export default function TodoMainSlash() {
  return (
    <div>
      <FormLikeEditorSlashWithStore />
      {/* <Inbox /> */}
    </div>
  )
}

function Inbox() {
  // useStorage is plasmo hook (see: https://docs.plasmo.com/framework/storage)
  //   const [tasks, _, { remove }] = useStorage(
  //     {
  //       key: "middle-tasks",
  //       instance: new Storage({
  //         area: "local" // use "sync" for production to sync with logged in email.
  //       })
  //     },
  //     // A funtion to get storage by provided key ("middle-tasks") if exists.
  //     // if not exists (first use), initilize the empty array for storing tasks.
  //     (v: Array<any>) => (!v ? [] : v)
  //   )

  return (
    <div>
      {/* {tasks &&
        tasks.length > 0 &&
        tasks.map((t, i) => (
          <div key={`taks_${i}`}>
            <RenderElementReadOnly {...t.task} />
          </div>
        ))}
      <div className="my-2">
        <p className="text-xs text-rose-500">for dev purposes</p>
        <button
          className="text-rose-500 border border-rose-500 rounded-lg p-1 hover:bg-gray-200 border-"
          onClick={() => remove()}>
          reset storage
        </button>
      </div> */}
    </div>
  )
}
