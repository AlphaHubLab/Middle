import Fuse from "fuse.js"
import type { FC } from "react"
import { CiSearch } from "react-icons/ci"

import { useDraft } from "~providers/draft-context"
import { usePersist } from "~providers/persist-context"
import type { IDraft, ITask } from "~lib/types"

export const SearchBar = ({ search, setSearch, onFocus }) => {
  return (
    <div className="py-3">
      <div className="w-full mx-auto has-[:focus]:outline outline-violet-400 shadow-sm border rounded-xl h-6 flex gap-2 px-1 items-center justify-center h-fit">
        <CiSearch />
        <input
          onFocus={onFocus}
          placeholder="(Fetch) some tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm appearence-none leading-tight p-1 w-full outline-none rounded-xl"
        />
      </div>
    </div>
  )
}

export const SearchResults = ({
  search,
  children
}: {
  search: string
  children: FC<{
    taskResults: ITask[]
    draftsResults: IDraft[]
    historyResults: ITask[]
  }>
}) => {
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

  const taskResults = searchedTask.search(search).map((s) => s.item)
  const historyResults = searchedHistory.search(search).map((s) => s.item)
  const draftsResults = searchedDrafts.search(search).map((s) => s.item)

  return children({ taskResults, historyResults, draftsResults })
}
