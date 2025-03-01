import { useEffect, useMemo, useState } from "react"
import type { IconType } from "react-icons"
import {
  // PiArrowSquareDown,
  PiBoxArrowDown,
  PiClockCounterClockwise,
  PiFunnel,
  PiMagnifyingGlass,
  PiNote,
  PiNotePencil
} from "react-icons/pi"

import { SearchBar, SearchResults } from "~components/search/search"
import { TaskGroup } from "~components/task-manager/inbox/task-group"
import Loading from "~components/ui/loading"
import { Modal } from "~components/ui/modal"
import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"
import { groupItems } from "~lib/cloud"
import type { IFilter, IFilterAction, IGroupedItems, ITask } from "~lib/types"

import { SelectableItem, SelectableList } from "./task-selector-items"

const filters: IFilter[] = [
  { title: "All Tasks", action: "all", icon: PiBoxArrowDown },
  { title: "Active", action: "active", icon: PiClockCounterClockwise },
  { title: "Completed", action: "completed", icon: PiClockCounterClockwise },
  { title: "Notes", action: "notes", icon: PiNote },
  { title: "Drafts", action: "drafts", icon: PiNotePencil }
  // { title: "Search", icon: PiMagnifyingGlass }
  //   { title: "Filter", icon: PiFunnel }
]

const filter = {
  active: (item: ITask) => item.dateDone === -1,
  completed: (item: ITask) => item.dateDone !== -1,
  notes: (item: ITask) => item.params.dueDate === -1
}

//npx update-browserslist-db@latest
export default function TaskSelector({
  show,
  title,
  selectedItems,
  setSelectedItems,
  onClose,
  skipSimilarIdentities
}) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"items" | "search">("items")
  const [filteredItems, setFilteredItems] = useState<IGroupedItems>({})
  const [activeFilter, setActiveFilter] = useState<IFilterAction | "none">(
    "all"
  )

  const { tasks, history, storageLoading, historyLoading } = usePersist()
  const { drafts } = useDraft()

  const allItems = useMemo(() => {
    if (!storageLoading && !historyLoading) {
      return groupItems([...tasks, ...history], skipSimilarIdentities)
    }
    return null
  }, [storageLoading, historyLoading, tasks, history])

  useEffect(() => {
    setFilteredItems(allItems)
  }, [allItems])

  useEffect(() => {
    if (activeFilter === "none") return
    setActiveTab("items")
    setFilteredItems(filterItems(activeFilter))
  }, [activeFilter])
  //   const filteredItems =

  const filterItems = (by: IFilterAction) => {
    if (by === "all") {
      return allItems
    }

    if (by === "drafts") {
      return drafts.reduce((a, v, i) => ({ ...a, [i]: [v] }), {})
    }

    const keys = Object.keys(allItems)

    const _items: IGroupedItems = {}

    for (let i = 0; i < keys.length; i++) {
      const filteredGroup = allItems[keys[i]].filter((item) => filter[by](item))
      if (filteredGroup.length > 0) {
        _items[keys[i]] = filteredGroup
      }
    }

    return _items
  }

  const handleSelectItems = (
    action: "select" | "deselect",
    itemIds: string[]
  ) => {
    if (action === "select") {
      const _selected = [...selectedItems]
      _selected.push(...itemIds)
      const selected = Array.from(new Set(_selected))
      setSelectedItems(selected)
      return
    }

    if (action === "deselect") {
      const selected = selectedItems.filter((id) => !itemIds.includes(id))
      setSelectedItems(selected)
      return
    }
  }

  return (
    <Modal
      onClose={onClose}
      show={show}
      className="w-full max-w-[600px] rounded-3xl bg-white h-full"
      title={
        <h1 className="flex items-center gap-2 w-full">
          <span className="text-fetch-primary">{title}</span>
        </h1>
      }>
      <div className="relative h-[calc(100%-60px)] bg-inherit">
        <div
          dir="ltr"
          role="tablist"
          aria-orientation="horizontal"
          className="sticky bg-inherit top-0 z-20 bg-inherit w-full flex gap-1 pb-2">
          {filters.map((filter) => (
            <button
              onClick={() => setActiveFilter(filter.action)}
              className={`border flex gap-2 items-center rounded-xl py-1 px-2 ${activeFilter === filter.action ? "text-white bg-fetch-primary font-semibold" : "text-fetch-primary font-normal bg-inherit hover:bg-violet-100"}`}
              key={filter.action}>
              <span className="text-normal">{<filter.icon />}</span>
              <span
                className={`${activeFilter === filter.action ? "flex" : "hidden"} lg:flex text-xs`}>
                {filter.title}
              </span>
            </button>
          ))}
        </div>
        <SearchBar
          search={search}
          setSearch={setSearch}
          onFocus={() => {
            setActiveTab("search")
            setActiveFilter("none")
          }}
        />
        <div
          className={`w-full styled-scrollbar overflow-y-auto h-[calc(100%-64px)] pr-2`}>
          {/* <a href="#other">OTHER</a> */}

          <div dir="ltr" className="mb-4 bg-inherit">
            {storageLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loading r={20} color="#aaaaaa" />
              </div>
            ) : (
              <div className="bg-inherit">
                {activeTab === "items" && (
                  <SelectableList
                    items={filteredItems}
                    setSelectedItems={handleSelectItems}
                    selectedItems={selectedItems}
                  />
                )}
                {activeTab === "search" && (
                  <div className="w-full">
                    {search.length < 2 ? (
                      <p className="text-black/50 text-sm text-center w-full">
                        Please type at least 2 letters.
                      </p>
                    ) : (
                      <SearchResults search={search}>
                        {(result) => (
                          <TaskGroup
                            variant="neutral"
                            label="Tasks"
                            value="tasks">
                            {result.taskResults.map(
                              (item, i) =>
                                i < 5 && (
                                  <SelectableItem
                                    key={item.id}
                                    setSelectedItems={handleSelectItems}
                                    item={item}
                                    isSelected={selectedItems.includes(item.id)}
                                  />
                                )
                            )}
                          </TaskGroup>
                        )}
                      </SearchResults>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
