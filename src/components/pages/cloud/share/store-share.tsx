import { useState } from "react"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import { Modal } from "~components/ui/modal"
import { Note } from "~components/ui/typograrphy"
import { createShare } from "~lib/cloud"
import { usePersist } from "~providers/persist-provider"
import { useRecurrence } from "~providers/recurrence-provider"
import { useSession } from "~providers/session-provider"

import TaskSelector from "../task-selector/task-selector"

const fetchApiUrl =
  process.env.PLASMO_PUBLIC_FETCH_API || "http://localhost:3000/api"

const defaultShareConfig = {
  tasks: true,
  history: true,
  customSelection: false
}

const categories = [
  { label: "Active tasks", value: "tasks" },
  { label: "History (Completed Tasks)", value: "history" }
]

export default function StoreShare() {
  const [shareConfig, setShareConfig] = useState(defaultShareConfig)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const { tasks, history } = usePersist()
  const { recurrences } = useRecurrence()
  const { session } = useSession()

  const authorizedWallet = session?.address

  const createAndStoreShare = async () => {
    if (name.length === 0) {
      setError(
        "Please enter a name for your share stuff.(e.g: How to farm fetch)"
      )
      return
    }

    if (shareConfig.customSelection && selectedItems.length === 0) {
      setError("Please select items to share")
      return
    }

    setLoading(true)

    const data = await createShare(
      tasks,
      history,
      recurrences,
      selectedItems,
      shareConfig
    )

    const share = {
      name,
      address: authorizedWallet,
      data
    }

    const res = await fetch(`${fetchApiUrl}/share/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(share)
    })

    if (res.ok) {
      const { name, uuid } = await res.json()
      alert(`${name},${uuid}`)
    } else {
      alert("Failed to create sharre")
    }

    setLoading(false)
  }

  const handleSelectCategory = (name: string) => {
    setShareConfig({
      ...shareConfig,
      customSelection: false,
      [name]: !shareConfig[name]
    })
  }

  const handleSelectCustomSelection = () => {
    setShowTaskSelector(true)
    setShareConfig({
      tasks: false,
      history: false,
      customSelection: true
    })
  }

  const isDisable = () => {
    return shareConfig.customSelection === true && selectedItems.length === 0
  }

  return (
    <div>
      <Modal
        onClose={() => setShowTaskSelector(false)}
        show={showTaskSelector}
        className="w-full max-w-[600px] rounded-3xl bg-white h-full"
        title={
          <h1 className="flex items-center gap-2 w-full">
            <span className="text-fetch-primary">Select Items to share</span>
          </h1>
        }>
        <TaskSelector
          items={{ tasks, history, drafts: [] }}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          skipSimilarIdentities={false}
          buttonAction={() => setShowTaskSelector(false)}
          buttonTitle="Ok"
        />
      </Modal>
      <div className="mt-4 mb-12">
        <Note variant="green">
          By using Share tab, your selected items shared WITHOUT any sensetive
          data like identities and wallet address.
        </Note>
        <h2 className="text-black/90 text-sm font-semibold">
          Select Items you want to share to public
        </h2>
        <div className="flex flex-col items-center justify-center mt-4">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`my-[2px] px-2 py-2 text-sm w-full flex items-center max-w-[350px] border transition rounded-xl duration-200 ${shareConfig[c.value] ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
              onClick={() => handleSelectCategory(c.value)}>
              <span className="w-full">{c.label}</span>
              <span
                className={`w-4 h-4 inline-block shrink-0 rounded-full after:rounded-full after:top-[2px] after:left-[2px] border relative after:absolute after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] ${shareConfig[c.value] ? " after:bg-fetch-primary border-fetch-primary" : "after:bg-white/50 border-black/15"}`}></span>
            </button>
          ))}
          <p className="text-sm mt-2 text-blue-400">or create a custom list</p>
          <button
            className={`my-[1px] px-2 flex items-center py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${shareConfig.customSelection ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
            onClick={handleSelectCustomSelection}>
            <span className="w-full">
              Custom Selection{" "}
              {shareConfig.customSelection && `(${selectedItems.length} Items)`}
            </span>
            <span
              className={`w-4 h-4 inline-block shrink-0 rounded-full after:rounded-full after:top-[2px] after:left-[2px] border relative after:absolute after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] ${shareConfig.customSelection ? " after:bg-fetch-primary border-fetch-primary" : "after:bg-white/50 border-black/15"}`}></span>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-black/70 text-sm">Choose a name</label>

        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="break-all text-black/50 border py-1 rounded-xl border-black/15"
          />
        </div>
      </div>
      <div>
        <p className="text-xs py-2 text-black/50">
          All backups will be stored for 30 days.
        </p>
        <ButtonFull
          disabled={isDisable() || loading}
          variant="primary"
          onClick={() => createAndStoreShare()}>
          {loading ? "loading" : "Share to public"}
        </ButtonFull>
      </div>
    </div>
  )
}
