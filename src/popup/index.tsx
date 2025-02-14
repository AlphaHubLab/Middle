import "../style.css"

import Popup from "~components/popup/popup"
import PersistProvider from "~contexts/persist-context"
import RecurrenceProvider from "~contexts/recurrence-context"

export default function IndexPopup() {
  return (
    <RecurrenceProvider>
      <PersistProvider>
        <Popup />
      </PersistProvider>
    </RecurrenceProvider>
  )
}
