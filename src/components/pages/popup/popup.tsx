// import PersistProvider from "~contexts/persist-context"
// import RecurrenceProvider from "~contexts/recurrence-context"

import FetchProvider from "~providers/fetch-provider"

import PopupComponent from "./popup-component"

export default function Popup() {
  return (
    <FetchProvider>
      <PopupComponent />
    </FetchProvider>
  )
}
