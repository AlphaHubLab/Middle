import PersistProvider from "~contexts/persist-context"
import RecurrenceProvider from "~contexts/recurrence-context"

import PopupComponent from "./popup-component"

export default function Popup() {
  return (
    <RecurrenceProvider>
      <PersistProvider>
        <PopupComponent />
      </PersistProvider>
    </RecurrenceProvider>
  )
}
