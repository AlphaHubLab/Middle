import { useEffect, useMemo, useState, type Dispatch } from "react"
import {
  PiBoxArrowDown,
  PiClockCounterClockwise,
  PiNote,
  PiNotePencil
} from "react-icons/pi"

import { SearchBar } from "~components/search/search"
import ButtonFull from "~components/ui/buttons/full-w-buttons"
import { groupItems } from "~lib/cloud"
import type {
  IDraft,
  IFilter,
  IFilterAction,
  IGroupedItems,
  ITask
} from "~lib/types"

import { SelectableList } from "./task-selector-items"
import TaskSelectorSearch from "./task-selector-search"

const defaultFilters: IFilter[] = [
  { title: "All Tasks", action: "all", icon: PiBoxArrowDown },
  { title: "Active", action: "active", icon: PiClockCounterClockwise },
  { title: "Completed", action: "completed", icon: PiClockCounterClockwise },
  { title: "Notes", action: "notes", icon: PiNote },
  { title: "Drafts", action: "drafts", icon: PiNotePencil }
  //   { title: "Filter", icon: PiFunnel }
]

const filter = {
  active: (item: ITask) => item.dateDone === -1,
  completed: (item: ITask) => item.dateDone !== -1,
  notes: (item: ITask) => item.params.dueDate === -1
}

interface ITaskSelectorProps {
  selectedItems: string[]
  setSelectedItems: Dispatch<string[]>
  skipSimilarIdentities: boolean
  overrideFilters?: IFilterAction[]
  items: { tasks: ITask[]; history: ITask[]; drafts: IDraft[] }
  buttonTitle?: string
  buttonAction?: () => any
}

//npx update-browserslist-db@latest
export default function TaskSelector({
  selectedItems,
  setSelectedItems,
  skipSimilarIdentities,
  items,
  overrideFilters,
  buttonTitle,
  buttonAction
}: ITaskSelectorProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"items" | "search">("items")
  const [filteredItems, setFilteredItems] = useState<IGroupedItems>({})
  const [activeFilter, setActiveFilter] = useState<IFilterAction | "none">(
    "all"
  )

  // const filters = noFilter ? [filtersTemplate[0]] : filtersTemplate
  const filters = !overrideFilters
    ? defaultFilters
    : defaultFilters.filter((f) => overrideFilters.includes(f.action))

  const height = buttonAction ? "h-[calc(100%-184px)]" : "h-[calc(100%-128px)]"

  const allItems = useMemo(
    () => groupItems([...items.tasks, ...items.history], skipSimilarIdentities),
    [items]
  )

  // useEffect(() => setFilteredItems(allItems), [allItems])

  useEffect(() => {
    if (activeFilter === "none") return
    setActiveTab("items")
    setFilteredItems(filterItems(activeFilter))
  }, [activeFilter])

  const filterItems = (by: IFilterAction) => {
    if (by === "all") {
      return allItems
    }

    if (by === "drafts") {
      return items.drafts?.reduce((a, v, i) => ({ ...a, [i]: [v] }), {})
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

  const getButtonLabel = () => {
    const activeLabel = filters.find((f) => f.action === activeFilter).title
    return activeLabel === "All tasks" ? "Tasks" : activeLabel
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

  const selectAll = () => {
    handleSelectItems(
      "select",
      Object.values(filteredItems)
        .map((array) => array.map((item) => item.id))
        .flat()
    )
  }

  const deselectAll = () => {
    setSelectedItems([])
  }

  return (
    <div className="relative h-[calc(100%-60px)] bg-inherit">
      <div
        dir="ltr"
        role="tablist"
        aria-orientation="horizontal"
        className="sticky bg-inherit top-0 z-20 bg-inherit w-full flex gap-1 pb-2">
        {filters.map((filter) => (
          <button
            onClick={() => setActiveFilter(filter.action)}
            className={`border flex gap-2 items-center rounded-xl h-6 px-2 ${activeFilter === filter.action ? "text-white bg-fetch-primary font-semibold" : "text-fetch-primary font-normal bg-inherit hover:bg-violet-100"}`}
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

      {activeTab !== "search" && (
        <div className="mt-4 flex w-full items-center justify-end gap-1">
          <button
            className="px-2 py-1 border border-blue-400 rounded-lg hover:text-blue-200 hover:border-blue-200 text-blue-400"
            onClick={deselectAll}>
            Reset selection
          </button>
          <button
            className="px-2 py-1 border rounded-lg bg-fetch-primary hover:bg-fetch-primary/80 text-white/90"
            onClick={selectAll}>
            Select all {getButtonLabel()}
          </button>
        </div>
      )}
      <div
        className={`mt-2 w-full styled-scrollbar border rounded-2xl p-2 overflow-y-auto pr-2 ${height}`}>
        <div dir="ltr" className="mb-4 bg-inherit">
          <div className="bg-inherit">
            {activeTab === "items" && (
              <SelectableList
                items={filteredItems}
                setSelectedItems={handleSelectItems}
                selectedItems={selectedItems}
              />
            )}
            {activeTab === "search" && (
              <TaskSelectorSearch
                search={search}
                selectedItems={selectedItems}
                handleSelectItems={handleSelectItems}
                {...items}
              />
            )}
          </div>
        </div>
      </div>
      {buttonAction && (
        <div className="my-2">
          <ButtonFull onClick={buttonAction} variant="primary">
            {buttonTitle}
          </ButtonFull>
        </div>
      )}
    </div>
  )
}
