import "../style.css"

import Popup from "~components/pages/popup"
import PersistProvider from "~contexts/persist-context"

export default function IndexPopup() {
  return (
    <PersistProvider>
      <Popup />
    </PersistProvider>
  )
}
