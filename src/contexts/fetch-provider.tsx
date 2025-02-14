import AppStateProvider from "./app-context"
import DraftProvider from "./draft-context"
import PersistProvider from "./persist-context"
import ReceurrenceProvider from "./recurrence-context"
import SettingProvider from "./setting-context"
import VisibleTasksProvider from "./visible-tasks-context"
// import Web3Provider from "./web3-context"

export default function FetchProvider({ children, isDev = false }) {
  return (
    // <Web3Provider>
      <SettingProvider isDev={isDev}>
        <AppStateProvider>
          <ReceurrenceProvider>
            <DraftProvider>
              <PersistProvider isDev={isDev}>
                <VisibleTasksProvider>{children}</VisibleTasksProvider>
              </PersistProvider>
            </DraftProvider>
          </ReceurrenceProvider>
        </AppStateProvider>
      </SettingProvider>
    // </Web3Provider>
  )
}
