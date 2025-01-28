import { createContext, useContext, useState, type Dispatch } from "react"

import { convertToStore, createEmptyStore } from "~lib/task-helpers"
import type { IStore, ITaskCore } from "~lib/types"

type IEditorType = "new" | "draft" | "task" | "reference"

interface IAppContext {
  openEditMode: (taskCore: ITaskCore, editorType: IEditorType) => void
  setEditMode: Dispatch<boolean>
  newEditor: (setActive?: boolean) => void
  editMode: boolean
  initialStore: IStore
  editorType: IEditorType
}

const App = createContext<IAppContext>(null)

export default function AppStateProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const [initialStore, setInitialStore] = useState<IStore>(createEmptyStore())
  const [editorType, setEditorType] = useState<IEditorType>("new")

  const newEditor = (setActive = true) => {
    setInitialStore(createEmptyStore())
    setEditorType("new")
    if (setActive) setEditMode(true)
  }

  const openEditMode = (taskCore: ITaskCore, editorType: IEditorType) => {
    // since drafts params is type of IStoreParams, convertToStore() should convert draft item differently
    // currently convertToStore() checks for "repeatParams" presence for difference between tasks and drafts

    // todo: dispatch for drafts and tasks in here and libs
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
