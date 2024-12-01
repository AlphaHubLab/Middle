import { createContext, useContext, useState } from "react"

import { convertToStore, createInitialStore } from "~lib/task-helpers"
import type { IStore, ITask, ITaskCore } from "~lib/types"

interface AppStateContext {
  goEditMode: (args: ITaskCore) => void
  goViewMode: (args: ITask) => void
  setEditMode: any
  editMode: boolean
  viewMode: boolean
  view: any
  initialStore: IStore
}

const AppState = createContext({} as AppStateContext)

export const AppStateProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false)
  const [initialStore, setInitialStore] = useState<IStore>(createInitialStore())
  const [view, setView] = useState<ITask | null>(null)
  const [viewMode, setViewMode] = useState(false)

  const goViewMode = (task: ITask) => {
    setView(task)
    setEditMode(false)
    setViewMode(true)
  }

  const goEditMode = (taskCore: ITaskCore) => {
    setEditMode(true)
    setViewMode(false)
    setInitialStore(convertToStore(taskCore))
  }

  const context = {
    goEditMode,
    goViewMode,
    setEditMode,
    editMode,
    viewMode,
    view,
    initialStore
  }

  return <AppState.Provider value={context}>{children}</AppState.Provider>
}

export const useAppState = () => useContext(AppState)
