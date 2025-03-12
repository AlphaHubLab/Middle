import { createContext, useContext, useState, type Dispatch } from "react"

import { convertToStore, createEmptyStore } from "~lib/task-helpers"
import type { IStore, ITaskCore } from "~lib/types"

type IEditorType = "new" | "draft" | "task" | "recurrence"

export interface IRecurrenceEditData {
  id: string
  taskId: string
  type: "all" | "single" | "identity" | "date" | ""
  identityId: number
  date: number
}

interface IAppContext {
  openEditMode: (taskCore: ITaskCore, editorType: IEditorType) => void
  setEditMode: Dispatch<boolean>
  newEditor: (setActive?: boolean) => void
  editMode: boolean
  initialStore: IStore
  editorType: IEditorType
  recurrenceEditData: IRecurrenceEditData
  setRecurrenceEditData: Dispatch<IRecurrenceEditData>
}

const App = createContext<IAppContext>(null)

/**
 * Responsible for changing app state between editmode/view mode and handles
 * all necessary functions and states.
 */
export default function AppStateProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const [initialStore, setInitialStore] = useState<IStore>(createEmptyStore())
  const [editorType, setEditorType] = useState<IEditorType>("new")
  const [recurrenceEditData, setRecurrenceEditData] =
    useState<IRecurrenceEditData>({
      id: "",
      taskId: "",
      type: "",
      date: -1,
      identityId: -1
    })

  const newEditor = (setActive = true) => {
    setInitialStore(createEmptyStore())
    setEditorType("new")
    if (setActive) setEditMode(true)
  }

  const openEditMode = (taskCore: ITaskCore, editorType: IEditorType) => {
    // since drafts and recurrece params is typeof IStoreParams,
    // convertToStore() should converts draft and recurrence items differently
    
    // currently convertToStore() checks for "repeatParams" presence for difference
    // between tasks and drafts/recurrence objects

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
    editorType,
    recurrenceEditData,
    setRecurrenceEditData
  }

  return <App.Provider value={context}>{children}</App.Provider>
}

export const useApp = () => useContext(App)
