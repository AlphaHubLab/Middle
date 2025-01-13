import { createContext, useContext, useState, type Dispatch } from "react"

import { convertToStore, createInitialStore } from "~lib/task-helpers"
import type { IStore, ITaskCore } from "~lib/types"

type IEditorType = "new" | "draft" | "task"

interface IAppContext {
  openEditMode: (taskCore: ITaskCore, editorType: IEditorType) => void
  setEditMode: Dispatch<boolean>
  newEditor: () => void
  editMode: boolean
  initialStore: IStore
  editorType: IEditorType
}

const App = createContext<IAppContext>(null)

export default function AppStateProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const [initialStore, setInitialStore] = useState<IStore>(createInitialStore())
  const [editorType, setEditorType] = useState<IEditorType>("new")

  // const [editor, setEditor] = useState({
  //   enabled: false,
  //   initialStore: createInitialStore(),
  //   type: "new"
  // })

  // const newEditor = () => {
  //   setEditor({
  //     enabled: true,
  //     initialStore: createInitialStore(),
  //     type: "new"
  //   })
  // }

  const newEditor = () => {
    setInitialStore(createInitialStore())
    setEditorType(editorType)
    setEditMode(true)
  }

  const openEditMode = (taskCore: ITaskCore, editorType: IEditorType) => {
    setInitialStore(convertToStore(taskCore))
    setEditorType(editorType)
    setEditMode(true)
  }

  const context = {
    openEditMode,
    setEditMode,
    newEditor,
    editMode,
    initialStore,
    editorType
  }

  return <App.Provider value={context}>{children}</App.Provider>
}

export const useApp = () => useContext(App)
