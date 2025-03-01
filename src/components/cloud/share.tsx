import { useState, type ChangeEvent } from "react"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import { Note, Section } from "~components/ui/typograrphy"
import { usePersist } from "~contexts/persist-context"
import { useRecurrence } from "~contexts/recurrence-context"
import { createShare } from "~lib/cloud"

import TaskSelector from "./task-selector/task-selector"

const defaultShareConfig = {
  tasks: true,
  history: true,
  customSelection: false
}

const categories = [
  { label: "Active tasks", value: "tasks" },
  { label: "History (Completed Tasks)", value: "history" }
]

export default function Share() {
  const [shareConfig, setShareConfig] = useState(defaultShareConfig)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [loading, setLoading] = useState(false)

  const { tasks, history } = usePersist()
  const { recurrences } = useRecurrence()

  const createAndStoreShare = async () => {
    setLoading(true)

    const data = await createShare(
      tasks,
      history,
      recurrences,
      selectedItems,
      shareConfig
    )

    const share = {
      data
    }

    setLoading(false)
    console.log(share)
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
    <Section title={"Share"}>
      <TaskSelector
        title={"Select Items to share"}
        show={showTaskSelector}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        onClose={() => setShowTaskSelector(false)}
        skipSimilarIdentities={true}
      />
      <div className="mt-4 mb-12">
        <h2 className="text-black/90 text-sm font-semibold">
          Select Items you want to share publicly
        </h2>
        <Note variant="green">
          By using Share tab, your selected items shared WITHOUT any sensetive
          data like identities and wallet address.
        </Note>
        <div className="flex flex-col items-center justify-center mt-4">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`my-[2px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${shareConfig[c.value] ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
              onClick={() => handleSelectCategory(c.value)}>
              {c.label}
            </button>
          ))}
          <p className="text-sm mt-2 text-blue-400">or create a custom list</p>
          <button
            className={`my-[1px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${shareConfig.customSelection ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
            onClick={handleSelectCustomSelection}>
            Custom Selection{" "}
            {shareConfig.customSelection && `(${selectedItems.length} Items)`}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-black/70 text-sm">
          Authorized wallet(s) to restore this backup
        </label>

        <div>
          <Input
            value={""}
            disabled
            className="break-all text-black/50 border py-1 rounded-xl border-black/15 bg-zinc-500/10"
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
          {loading ? "loading" : "Shaer"}
        </ButtonFull>
      </div>
    </Section>
  )
}
