import AppStateProvider from "./app-context"
import DraftProvider from "./draft-context"
import PersistProvider from "./persist-context"
import RecurrenceProvider from "./recurrence-context"
import SettingProvider from "./setting-context"
import VisibleTasksProvider from "./visible-tasks-context"

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
