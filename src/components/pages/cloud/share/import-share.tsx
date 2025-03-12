import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Success } from "~components/general/generals"
import ButtonFull from "~components/ui/buttons/full-w-buttons"
import Input from "~components/ui/input"
import Label from "~components/ui/label"
import Loading from "~components/ui/loading"
import { Modal } from "~components/ui/modal"
import type { IRecurrence, IShareData } from "~lib/types"
import { usePersist } from "~providers/persist-provider"
import { useRecurrence } from "~providers/recurrence-provider"

import TaskSelector from "../task-selector/task-selector"

const fetchApiUrl =
  process.env.PLASMO_PUBLIC_FETCH_API || "http://localhost:3000/api"

export default function ImportShare() {
  const [shareId, setShareId] = useState("")
  const [error, setError] = useState("")
  const [fetching, setFetching] = useState(false)
  const [fetchedItems, setFetchedItems] = useState<IShareData | null>(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [imported, setImported] = useState(false)

  const { setRecurrences } = useRecurrence()
  const { setTasks } = usePersist()

  const uuidRegex = new RegExp(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  )
  const getSharedItemsByUUID = async () => {
    setError("")

    if (!shareId.match(uuidRegex)) {
      setError("The id is not correct")
      return
    }

    setFetching(true)

    try {
      const res = await fetch(`${fetchApiUrl}/share/import`, {
        method: "POST",
        body: JSON.stringify({ shareId })
      })

      if (res.status === 201) {
        const { data } = await res.json()
        setFetchedItems(JSON.parse(data))
      } else if (res.status === 400) {
        setError("We could not find items with this id.")
      } else {
        setError("Something is wrong. We are working hard to fix it.")
      }
    } catch (err) {
      setError("We cannot reach the server right now. please try again later.")
    }

    setFetching(false)
  }

  const importItems = () => {
    const _tasks = structuredClone(fetchedItems.tasks)
    const _recurrences = structuredClone(fetchedItems.recurrences)

    const selected = _tasks.filter((item) => selectedItems.includes(item.id))

    const selectedRecurrences: IRecurrence[] = []

    const mappedIds = {}

    for (let i = 0; i < _recurrences.length; i++) {
      const newRecurrenceId = uuidv4()
      mappedIds[_recurrences[i].id] = newRecurrenceId
      _recurrences[i].id = newRecurrenceId
    }

    console.log(mappedIds)

    for (let i = 0; i < selected.length; i++) {
      selected[i].id = uuidv4()

      if (selected[i].recurrenceId.length > 0) {
        selected[i].recurrenceId = mappedIds[selected[i].recurrenceId]

        if (
          !selectedRecurrences.find((r) => r.id === selected[i].recurrenceId)
        ) {
          const found = _recurrences.find(
            (r) => r.id === selected[i].recurrenceId
          )

          selectedRecurrences.push(found)
        }
      }
    }

    setTasks((prev) => [...prev, ...selected])
    setRecurrences((prev) => [...prev, ...selectedRecurrences])
    setImported(true)
  }

  return (
    <div className="mt-4">
      {fetchedItems && (
        <Modal
          onClose={() => setFetchedItems(null)}
          show={true}
          className="w-full max-w-[600px] rounded-3xl bg-white h-full"
          title={
            <h1 className="flex items-center gap-2 w-full">
              <span className="text-fetch-primary">Select Items to import</span>
            </h1>
          }>
          {!imported && (
            <TaskSelector
              overrideFilters={["all"]}
              selectedItems={selectedItems}
              items={{ tasks: fetchedItems.tasks, history: [], drafts: [] }}
              setSelectedItems={setSelectedItems}
              skipSimilarIdentities={true}
              buttonTitle={`Import ${selectedItems.length} items`}
              buttonAction={importItems}
            />
          )}
          {imported && <Success text="Selected Items successfully imported!" />}
        </Modal>
      )}
      <h2 className="text-black/90 text-sm font-semibold">
        Import Tasks by id
      </h2>
      <div className="h-24 flex items-center w-full">
        <div className="w-full">
          <Label>Paste your id</Label>
          <p className="text-black/50 text-xs pb-1">
            e.g.: 98ae34db-0ae8-4c58-9176-b9b8e55ec1d5
          </p>
          <Input value={shareId} onChange={(e) => setShareId(e.target.value)} />
        </div>
      </div>

      <p className="py-1 text-black/50 text-xs">
        After loading, you can choose items to import
      </p>
      <ButtonFull
        variant="primary"
        disabled={fetching}
        onClick={() => getSharedItemsByUUID()}>
        {fetching ? <Loading r={10} color={"#fff"} /> : "Load Items"}
      </ButtonFull>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  )
}
