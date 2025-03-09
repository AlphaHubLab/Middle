import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { PiTrash } from "react-icons/pi"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import PasswordInput from "~components/ui/input-password"
import { Modal } from "~components/ui/modal"
import { FETCH_API } from "~fetch.config"
import { createBackup } from "~lib/cloud"
import type { IBackupConfig } from "~lib/types"
import { useDraft } from "~providers/draft-context"
import { usePersist } from "~providers/persist-context"
import { useRecurrence } from "~providers/recurrence-context"
import { useSession } from "~providers/session-provider"
import { useSetting } from "~providers/setting-context"

import TaskSelector from "../task-selector/task-selector"

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

export default function StoreBackup() {
  const { session } = useSession()
  const authorizedWallet = session?.address

  const [pwd, setPwd] = useState("")
  const [pwd2, setPwd2] = useState("")
  const [wallets, setWallets] = useState([authorizedWallet])
  const [changeWallet, setChangeWallet] = useState(false)
  const [backupConfig, setBackupConfig] = useState(defaultSelection)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const { tasks, history, storageLoading, historyLoading } = usePersist()
  const { drafts } = useDraft()
  const { recurrences } = useRecurrence()
  const { setting } = useSetting()

  const createAndStoreBackup = async () => {
    setError("")

    if (pwd !== pwd2) {
      setError("Passwords are not match.")
      return
    }

    if (name.length === 0) {
      setError("Please enter a name for the backup")
      return
    }

    if (pwd.length === 0) {
      setError("Please enter a password")
      return
    }

    if (backupConfig.customSelection && selectedItems.length === 0) {
      setError("Please select items to backup")
      return
    }

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
      address: authorizedWallet,
      name,
      data,
      pwd,
      wallets
    }

    const res = await fetch(`${FETCH_API}/backup/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(backup)
    })

    if (res.ok) {
      alert("Backup created successfully")
    } else {
      alert("Failed to create backup")
    }

    setLoading(false)
  }

  const handleChangeWallets = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const _wallets = [...wallets]
    // @ts-ignore
    _wallets[i] = e.target.value
    setWallets(_wallets)
  }

  useEffect(() => setError(""), [name, pwd, pwd2])
  // @ts-ignoreƒ
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
    <div>
      <Modal
        onClose={() => setShowTaskSelector(false)}
        show={showTaskSelector}
        className="w-full max-w-[600px] rounded-3xl bg-white h-full"
        title={
          <h1 className="flex items-center gap-2 w-full">
            <span className="text-fetch-primary">Select Items to backup</span>
          </h1>
        }>
        <TaskSelector
          items={{ tasks, history, drafts }}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          skipSimilarIdentities={false}
          buttonTitle="Ok"
          buttonAction={() => setShowTaskSelector(false)}
        />
      </Modal>
      <div className="mt-4 mb-12">
        <h2 className="text-black/90 text-sm font-semibold">
          Select Items you want to backup
        </h2>
        <div className="flex flex-col items-center justify-center mt-4">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`my-[2px] px-2 py-2 text-sm w-full flex items-center max-w-[350px] border transition rounded-xl duration-200 ${backupConfig[c.value] ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
              onClick={() => handleSelectCategory(c.value)}>
              <span className="w-full">{c.label}</span>
              <span
                className={`w-4 h-4 inline-block shrink-0 rounded-full after:rounded-full after:top-[2px] after:left-[2px] border relative after:absolute after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] ${backupConfig[c.value] ? " after:bg-fetch-primary border-fetch-primary" : "after:bg-white/50 border-black/15"}`}></span>
            </button>
          ))}
          <p className="text-sm mt-2 text-blue-400">or create a custom list</p>
          <button
            className={`my-[1px] px-2 flex items-center py-2 text-sm w-full max-w-[350px] border transition rounded-xl duration-200 ${backupConfig.customSelection ? "border-fetch-primary text-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : "text-black/70 border-black/15 hover:bg-zinc-500/10"}`}
            onClick={handleSelectCustomSelection}>
            <span className="w-full">
              Custom Selection{" "}
              {backupConfig.customSelection &&
                `(${selectedItems.length} Items)`}
            </span>
            <span
              className={`w-4 h-4 inline-block shrink-0 rounded-full after:rounded-full after:top-[2px] after:left-[2px] border relative after:absolute after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] ${backupConfig.customSelection ? " after:bg-fetch-primary border-fetch-primary" : "after:bg-white/50 border-black/15"}`}></span>
          </button>
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-black/90">
          Choose a name for backup
        </h2>
        <div className="my-2">
          <label className="block text-black/70 text-sm">Name</label>
          <Input onChange={(e) => setName(e.target.value)} />
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
          disabled={loading}
          variant="primary"
          onClick={() => createAndStoreBackup()}>
          {loading ? "loading" : "Create Backup"}
        </ButtonFull>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    </div>
  )
}
