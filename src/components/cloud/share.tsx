import { useState, type ChangeEvent } from "react"
import { PiTrash } from "react-icons/pi"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import PasswordInput from "~components/ui/input-password"
import { Note, Section } from "~components/ui/typograrphy"

import TaskSelector from "./task-selector/task-selector"

const defaultSelection = {
  tasks: true,
  history: true
}

const categories = [
  { label: "Active tasks", value: "tasks" },
  { label: "History (Completed Tasks)", value: "history" }
]

export default function Share() {
  const authorizedWallet = "0x0"

  const [wallets, setWallets] = useState([authorizedWallet])
  const [changeWallet, setChangeWallet] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(defaultSelection)
  const [customSelection, setCustomSelection] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)

  const backup = () => {}

  const handleChangeWallets = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const _wallets = [...wallets]
    _wallets[i] = e.target.value
    setWallets(_wallets)
  }

  const addWallet = () => setWallets([...wallets, ""])

  const removeWallet = (i: number) => {
    const _wallets = [...wallets]
    _wallets.splice(i, 1)
    setWallets(_wallets)
  }

  const handleSelectCategory = (name: string) => {
    setCustomSelection(false)
    setSelectedCategories({
      ...selectedCategories,
      [name]: !selectedCategories[name]
    })
  }

  const handleSelectCustomSelection = () => {
    setShowTaskSelector(true)
    setCustomSelection(true)
    setSelectedCategories({
      tasks: false,
      history: false
    })
  }

  return (
    <Section title={"Backup for myself"}>
      <TaskSelector
        title={"Select Items to backup"}
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
              className={`my-[2px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${selectedCategories[c.value] ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
              onClick={() => handleSelectCategory(c.value)}>
              {c.label}
            </button>
          ))}
          <p className="text-sm mt-2 text-blue-400">or create a custom list</p>
          <button
            className={`my-[1px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${customSelection ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
            onClick={handleSelectCustomSelection}>
            Custom Selection{" "}
            {customSelection && `(${selectedItems.length} Items)`}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-black/70 text-sm">
          Authorized wallet(s) to restore this backup
        </label>
        {!changeWallet && (
          <div>
            <Input
              value={wallets[0]}
              disabled
              className="break-all text-black/50 border py-1 rounded-xl border-black/15 bg-zinc-500/10"
            />
            <div>
              <p className="text-blue-500 text-xs mt-2">
                I Want to grant access to another wallet(s) to restore this
                backup
              </p>
              <ButtonFull onClick={() => setChangeWallet(true)} variant="blue">
                Grant access
              </ButtonFull>
            </div>
          </div>
        )}
        {changeWallet && (
          <div>
            {wallets.map((wallet, i) => (
              <div className="flex gap-2 mb-1">
                <Input
                  className="py-1 rounded-xl"
                  key={`wallet-${i}`}
                  value={wallet}
                  onChange={(e) => handleChangeWallets(e, i)}
                />

                {i !== 0 && (
                  <button
                    className="text-rose-500 hover:text-rose-300"
                    onClick={() => removeWallet(i)}
                    aria-label="Remove wallet">
                    <PiTrash />
                  </button>
                )}
              </div>
            ))}
            <p className="text-blue-500 text-xs mt-2">
              Owner(s) of the above wallet(s) can restore the backup if they
              have the password.
            </p>
            <div className="flex gap-2">
              <ButtonFull onClick={addWallet} variant="blue">
                Add a wallet
              </ButtonFull>
              <ButtonFull
                onClick={() => {
                  setChangeWallet(false)
                  setWallets([authorizedWallet])
                }}
                variant="red">
                Cancel
              </ButtonFull>
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs py-2 text-black/50">
          All backups will be stored for 30 days.
        </p>
        <ButtonFull disabled={selectedItems.length === 0} variant="primary">
          Get the share
        </ButtonFull>
      </div>
    </Section>
  )
}
