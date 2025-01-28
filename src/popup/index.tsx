import "../style.css"

import Popup from "~components/pages/popup"
import PersistProvider from "~contexts/persist-context"
import ReferenceProvider from "~contexts/reference-context"

export default function IndexPopup() {
  return (
    <ReferenceProvider>
      <PersistProvider>
        <Popup />
      </PersistProvider>
    </ReferenceProvider>
  )
}
