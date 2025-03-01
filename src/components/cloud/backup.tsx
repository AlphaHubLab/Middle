import { useState, type ChangeEvent } from "react"
import { PiTrash } from "react-icons/pi"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import PasswordInput from "~components/ui/input-password"
import { Section } from "~components/ui/typograrphy"
import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"
import { useRecurrence } from "~contexts/recurrence-context"
import { useSetting } from "~contexts/setting-context"
import { createBackup } from "~lib/cloud"
import type { IBackupConfig } from "~lib/types"

import TaskSelector from "./task-selector/task-selector"

const defaultSelection: IBackupConfig = {
  tasks: true,
  drafts: false,
  setting: true,
  history: true,
  customSelection: false
}

const categories = [
  { label: "Active tasks", value: "tasks" },
  { label: "History (Completed Tasks)", value: "history" },
  { label: "Settings & Identities", value: "setting" },
  { label: "Drafts", value: "drafts" }
]

export default function SelfBackup() {
  const authorizedWallet = "0x0"

  const [pwd, setPwd] = useState("")
  const [pwd2, setPwd2] = useState("")
  const [wallets, setWallets] = useState([authorizedWallet])
  const [changeWallet, setChangeWallet] = useState(false)
  const [backupConfig, setBackupConfig] = useState(defaultSelection)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [loading, setLoading] = useState(false)

  const { tasks, history } = usePersist()
  const { drafts } = useDraft()
  const { recurrences } = useRecurrence()
  const { setting } = useSetting()

  const createAndStoreBackup = async () => {
    setLoading(true)

    const data = await createBackup(
      tasks,
      history,
      drafts,
      recurrences,
      setting,
      selectedItems,
      backupConfig
    )

    const backup = {
      data,
      pwd,
      wallets
    }

    setLoading(false)
    console.log(backup)
  }

  const handleChangeWallets = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const _wallets = [...wallets]
    _wallets[i] = e.target.value
    setWallets(_wallets)
  }

  const isDisable = () => {
    return (
      pwd.length === 0 ||
      pwd2.length === 0 ||
      pwd !== pwd2 ||
      (backupConfig.customSelection === true && selectedItems.length === 0)
    )
  }

  const addWallet = () => setWallets([...wallets, ""])

  const removeWallet = (i: number) => {
    const _wallets = [...wallets]
    _wallets.splice(i, 1)
    setWallets(_wallets)
  }

  const handleSelectCategory = (name: string) => {
    setBackupConfig({
      ...backupConfig,
      customSelection:
        name === "setting" ? backupConfig.customSelection : false,
      [name]: !backupConfig[name]
    })
  }

  const handleSelectCustomSelection = () => {
    setShowTaskSelector(true)
    setBackupConfig({
      tasks: false,
      drafts: false,
      setting: backupConfig.setting,
      history: false,
      customSelection: true
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
        skipSimilarIdentities={false}
      />
      <div className="mt-4 mb-12">
        <h2 className="text-black/90 text-sm font-semibold">
          Select Items you want to backup
        </h2>
        <div className="flex flex-col items-center justify-center mt-4">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`my-[2px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${backupConfig[c.value] ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
              onClick={() => handleSelectCategory(c.value)}>
              {c.label}
            </button>
          ))}
          <p className="text-sm mt-2 text-blue-400">or create a custom list</p>
          <button
            className={`my-[1px] block py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${backupConfig.customSelection ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
            onClick={handleSelectCustomSelection}>
            Custom Selection{" "}
            {backupConfig.customSelection && `(${selectedItems.length} Items)`}
          </button>
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-black/90">
          Choose a password to restore this backup
        </h2>
        <p className="text-xs text-orange-400">
          Without this password, the backup cannot be recovered.
        </p>
        <div className="my-2">
          <label className="block text-black/70 text-sm">New Password</label>
          <PasswordInput setter={setPwd} />
        </div>
        <div className="my-2">
          <label className="block text-black/70 text-sm">
            Re-enter the password
          </label>
          <PasswordInput setter={setPwd2} />
          {pwd !== pwd2 && pwd2 !== "" && (
            <p className="text-xs text-rose-500">Passwords are not match.</p>
          )}
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
              <div key={`wallet-${i}`} className="flex gap-2 mb-1">
                <Input
                  className="py-1 rounded-xl"
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
        <ButtonFull
          disabled={isDisable() || loading}
          variant="primary"
          onClick={() => createAndStoreBackup()}>
          {loading ? "loading" : "Create Backup"}
        </ButtonFull>
      </div>
    </Section>
  )
}
