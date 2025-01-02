import AppStateProvider  from "./app-context"
import DraftProvider from "./draft-context"
import PersistProvider from "./persisting-context"
import SettingProvider from "./setting-context"
import VisibleTasksProvider from "./visible-tasks-context"

export default function FetchProvider({ children, isDev = false }) {
  return (
    <SettingProvider isDev={isDev}>
      <DraftProvider>
        <PersistProvider isDev={isDev}>
          <VisibleTasksProvider>
            <AppStateProvider>{children}</AppStateProvider>
          </VisibleTasksProvider>
        </PersistProvider>
      </DraftProvider>
    </SettingProvider>
  )
}
