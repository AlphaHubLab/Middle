import { createContext, useContext, useState } from "react"

import { convertToStore, createInitialStore } from "~lib/task-helpers"
import type { IStore, ITask, ITaskCore } from "~lib/types"

type IEditorType = "new" | "draft" | "task"

interface AppStateContext {
  openEditMode: (taskCore: ITaskCore, editorType: IEditorType) => void
  openViewMode: (task: ITask) => void
  setEditMode: any
  editMode: boolean
  viewMode: boolean
  view: any
  initialStore: IStore
  editorType: IEditorType
}

const AppState = createContext({} as AppStateContext)

export const AppStateProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false)
  const [initialStore, setInitialStore] = useState<IStore>(createInitialStore())
  const [view, setView] = useState<ITask | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const [editorType, setEditorType] = useState<IEditorType>("new")

  const openViewMode = (task: ITask) => {
    setView(task)
    setEditMode(false)
    setViewMode(true)
  }

  const openEditMode = (taskCore: ITaskCore, editorType: IEditorType) => {
    setEditorType(editorType)
    setEditMode(true)
    setViewMode(false)
    setInitialStore(convertToStore(taskCore))
  }

  const context = {
    openEditMode,
    openViewMode,
    setEditMode,
    editMode,
    viewMode,
    view,
    initialStore,
    editorType
  }

  return <AppState.Provider value={context}>{children}</AppState.Provider>
}

export const useAppState = () => useContext(AppState)
