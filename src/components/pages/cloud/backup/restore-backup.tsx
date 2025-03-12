import { useState } from "react"

import { Success } from "~components/general/generals"
import { DateReadOnly } from "~components/renderables/render-element-readonly"
import ButtonFull from "~components/ui/buttons/full-w-buttons"
import PasswordInput from "~components/ui/input-password"
import Loading from "~components/ui/loading"
import { Modal } from "~components/ui/modal"
import { useDraft } from "~providers/draft-context"
import { usePersist } from "~providers/persist-provider"
import { useRecurrence } from "~providers/recurrence-provider"
import { useSession } from "~providers/session-provider"
import { useSetting } from "~providers/setting-provider"

const fetchApiUrl =
  process.env.PLASMO_PUBLIC_FETCH_API || "http://localhost:3000/api"

export default function RestoreBackup({
  backups,
  setBackups,
  fetched,
  setFetched
}: any) {
  const [fetching, setFetching] = useState(false)
  const [modalProps, setModalProps] = useState({
    show: false,
    uuid: ""
  })
  const [error, setError] = useState("")

  const { session } = useSession()
  const fetchBackups = async () => {
    setError("")
    setFetching(true)

    try {
      const res = await fetch(`${fetchApiUrl}/backup/get-available-backups`, {
        method: "POST",
        body: JSON.stringify({ address: session.address })
      })

      if (res.ok) {
        const { availableBackups } = await res.json()
        setFetched(true)
        setBackups(availableBackups)
      } else {
        setError("Something is wrong. We are working hard to fix it.")
      }
    } catch (err) {
      setError("We cannot reach the server right now. please try again later.")
    }
    setFetching(false)
  }

  return (
    <div className="mt-4">
      <h2 className="text-black/90 text-sm font-semibold">Restore Backup</h2>
      {modalProps.show && (
        <RestoreModal
          {...modalProps}
          onClose={() => setModalProps({ uuid: "", show: false })}
        />
      )}
      <div className="flex justify-center my-2 w-full h-24 items-center">
        <div className="w-full max-w-[400px]">
          <ButtonFull
            onClick={() => fetchBackups()}
            disabled={fetching}
            variant="primary">
            {fetching ? (
              <Loading r={10} color={"#fff"} />
            ) : fetched ? (
              "Refetch"
            ) : (
              "Fetch"
            )}{" "}
            my available backups
          </ButtonFull>
        </div>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      {fetched && backups.length === 0 && (
        <p className="w-full text-center text-black/70 text-xs mt-2">
          No backups available
        </p>
      )}
      {fetched && backups.length > 0 && (
        <div>
          <h2 className="border-b border-black/15 text-black/90 text-sm font-semibold">
            Available Backups
          </h2>
          {backups.map(
            (backup: {
              backup_name: string
              uuid: string
              created_at: number
            }) => (
              <div
                className="border-black/15 flex flex-col sm:flex-row border border-black/15 rounded-xl p-3 my-1"
                key={backup.uuid}>
                <div className="w-full">
                  <h2 className="text-sm font-semibold">
                    {backup.backup_name}
                  </h2>
                  <DateReadOnly timestamp={backup.created_at} />
                </div>
                <div>
                  <ButtonFull
                    onClick={() => {
                      setModalProps({
                        show: true,
                        uuid: backup.uuid
                      })
                    }}
                    variant="primary">
                    Restore
                  </ButtonFull>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

const RestoreModal = ({ show, onClose, uuid }: any) => {
  const [pwd, setPwd] = useState("")
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const { setDrafts } = useDraft()
  const { setHistory, setTasks } = usePersist()
  const { setRecurrences } = useRecurrence()
  const { setSetting } = useSetting()

  const restoreBackup = async () => {
    setLoading(true)

    const res = await fetch(`${fetchApiUrl}/backup/restore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uuid, pwd })
    })

    if (res.ok) {
      const { backup: json } = await res.json()

      const backup = JSON.parse(json)

      const { drafts, recurrences, tasks, history, setting } = backup

      console.log(backup)
      if (drafts.length > 0) setDrafts(drafts)
      if (recurrences.length > 0) setRecurrences(recurrences)
      if (tasks.length > 0) setTasks(tasks)
      if (history.length > 0) setHistory(history)
      if (setting) setSetting(setting)

      setRestored(backup)
    } else {
      alert("Failed to restore backup")
    }

    setLoading(false)
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title="Restore Backup">
      {restored && (
        <Success text="Backup Restored Successfully!" buttonTitle="Great!" />
      )}
      {!restored && (
        <>
          <h2 className="text-sm font-semibold text-black/90">
            Enter the password to restore the backup
          </h2>
          <div className="mt-8 mb-10">
            <label className="block text-black/70 text-sm">
              Backup Password
            </label>
            <PasswordInput setter={setPwd} />
          </div>

          <ButtonFull
            disabled={loading || pwd.length === 0}
            variant="primary"
            onClick={() => restoreBackup()}>
            {pwd.length === 0 ? (
              "Enter Password"
            ) : loading ? (
              <Loading r={10} color={"#fff"} />
            ) : (
              "Restore Backup"
            )}
          </ButtonFull>
        </>
      )}
    </Modal>
  )
}
