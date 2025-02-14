import Fuse from "fuse.js"
import { useState } from "react"
import { CiSearch } from "react-icons/ci"

import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"

import { DraftItem, HistoryItem, UpcomingItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

export default function SearchList() {
  const [search, setSearch] = useState("")

  return (
    <div dir="ltr">
      <div className="pt-2 pb-4 px-2">
        <div className="w-full mx-auto has-[:focus]:outline outline-violet-400 shadow-sm border rounded-xl h-6 flex gap-2 px-1 items-center justify-center h-fit">
          <CiSearch />
          <input
            id="search-bar"
            placeholder="(Fetch) some tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm appearence-none leading-tight p-1 w-full outline-none rounded-xl"
          />
        </div>
      </div>
      <SearchResults searched={search} />
    </div>
  )
}

const SearchResults = ({ searched }) => {
  const { tasks, history } = usePersist()
  const { drafts } = useDraft()

  const searchedTask = new Fuse(tasks, {
    keys: ["nodes.value", "params.tags"],
    minMatchCharLength: 2
  })

  const searchedHistory = new Fuse(history, {
    keys: ["nodes.value", "params.tags"],
    minMatchCharLength: 2
  })

  const searchedDrafts = new Fuse(drafts, {
    keys: ["nodes.value", "params.tags"],
    minMatchCharLength: 2
  })

  const taskResults = searchedTask.search(searched).map((s) => s.item)
  const historyResults = searchedHistory.search(searched).map((s) => s.item)
  const draftsResults = searchedDrafts.search(searched).map((s) => s.item)

  return (
    <>
      {searched.length < 2 && (
        <p className="text-sm w-full h-full items-center justify-center flex text-zinc-400">
          Need at least 2 letters to fetch
        </p>
      )}
      {searched.length >= 2 && (
        <div className="h-full overflow-y-auto styled-scrollbar p-2">
          <TaskGroupWrapper messageType="search">
            <TaskGroup variant="neutral" label="Tasks" value="tasks">
              {taskResults.map(
                (item, i) =>
                  i < 5 && (
                    <UpcomingItem
                      variant="neutral"
                      key={`searched-task-${item.id}`}
                      item={item}
                      type="task"
                    />
                  )
              )}
            </TaskGroup>
            <TaskGroup variant="neutral" label="Drafts" value="drafts">
              {draftsResults.map(
                (item, i) =>
                  i < 5 && (
                    <DraftItem
                      key={`searched-draft-${item.id}`}
                      item={item}
                      type="task"
                    />
                  )
              )}
            </TaskGroup>
            <TaskGroup variant="neutral" label="History" value="history">
              {historyResults.map(
                (item, i) =>
                  i < 5 && (
                    <HistoryItem
                      key={`searched-history-${item.id}`}
                      item={item}
                    />
                  )
              )}
            </TaskGroup>
          </TaskGroupWrapper>
        </div>
      )}
    </>
  )
}

// This is a simple search
// Searching can be replaced with fusejs for fuzzy search if needed
// https://www.fusejs.io/
// const searching = (str: string, storage: ITaskCore[]) => {
//   if (str.match(/\/|\\|\*|\[|\]|\(|\)|\+|\?|\:|\^|\$|\|/g)) {
//     return []
//   }

//   const searchKey = new RegExp(str.trim().toLowerCase(), "g")
//   // let b = 0

//   // for (let i = 0; i < 100000000; i++) {
//   //   b = b + i
//   // }

//   return storage.filter(
//     (item) =>
//       item.params.tags
//         .map((t) => t.toLowerCase().match(searchKey))
//         .filter((r) => r).length > 0 ||
//       item.nodes
//         .map((n) => n.value.toLowerCase().match(searchKey))
//         .filter((r) => r).length > 0
//   )
// }
