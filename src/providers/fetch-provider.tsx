import AppStateProvider from "./app-context"
import DraftProvider from "./draft-context"
import PersistProvider from "./persist-provider"
import RecurrenceProvider from "./recurrence-provider"
import SettingProvider from "./setting-provider"
import VisibleTasksProvider from "./visible-tasks-provider"

export default function FetchProvider({ children, isDev = false }) {
  return (
    <SettingProvider isDev={isDev}>
      <AppStateProvider>
        <RecurrenceProvider>
          <DraftProvider>
            <PersistProvider isDev={isDev}>
              <VisibleTasksProvider>{children}</VisibleTasksProvider>
            </PersistProvider>
          </DraftProvider>
        </RecurrenceProvider>
      </AppStateProvider>
    </SettingProvider>
  )
}
