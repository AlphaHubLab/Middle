import { Children, useEffect, useState } from "react"
import type { ReactNode } from "react"

import { LabelStatus, TimeStatus } from "~components/renderables/status"
import { ItemBriefView } from "~components/task-manager/items/items"
import type { IGroupedItems, ITask } from "~lib/types"

export const SelectableList = ({
  items,
  selectedItems,
  setSelectedItems
}: {
  items: IGroupedItems
  selectedItems: string[]
  setSelectedItems: (action: "select" | "deselect", id: string[]) => void
}) => {
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => setFilteredItems(items), [items])

  if (!filteredItems) {
    return (
      <div className="w-full h-full flex justify-center items-center text-zinc-300 text-sm">
        Nothing to select
      </div>
    )
  }

  return (
    <div className="w-full">
      {Object.keys(items).map((group) => (
        <GroupItem key={group} setSelectedItems={setSelectedItems}>
          {items[group].map((item) => (
            <SelectableItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </GroupItem>
      ))}
    </div>
  )
}

export const GroupItem = ({
  children,
  setSelectedItems
}: {
  children: ReactNode | ReactNode[]
  setSelectedItems: (action: "select" | "deselect", id: string[]) => void
}) => {
  const ch = Children.toArray(children)

  if (ch.length === 1) {
    return ch
  }

  // @ts-ignore
  const isAllSelected = ch.every((child) => child.props.isSelected)

  const handleCheck = () => {
    setSelectedItems(
      isAllSelected ? "deselect" : "select",
      // @ts-ignore
      ch.map((child) => child.props.item.id)
    )
  }

  return (
    <div className="my-6">
      <div className="border-b flex gap-1 py-1">
        <input
          checked={isAllSelected}
          className="accent-violet-500 cursor-pointer w-[16px] h-[16px]"
          type="checkbox"
          onChange={handleCheck}
        />
        <label className="font-semibold text-black/90">
          {isAllSelected ? "Unselect all" : "Select All"}
        </label>
      </div>
      {ch}
    </div>
  )
}

export const SelectableItem = ({
  item,
  isSelected,
  setSelectedItems
}: {
  item: ITask
  isSelected: boolean
  setSelectedItems: (action: "select" | "deselect", id: string[]) => void
}) => {
  return (
    <div
      onClick={() =>
        setSelectedItems(isSelected ? "deselect" : "select", [item.id])
      }
      className={`my-2 cursor-pointer border rounded-2xl overflow-hidden ${isSelected ? "border-fetch-primary bg-fetch-secondary/40 hover:bg-fetch-secondary/70" : " bg-slate-50/50 hover:bg-slate-100 border-black/15"}`}>
      <div className="h-10 dark:bg-white/10 hover:cursor-pointer select-none">
        <div className="flex gap-2 items-center h-full">
          <div className="px-2 flex-auto">
            <ItemBriefView item={item} />
          </div>

          <TimeStatus
            item={item}
            itemType={item.dateDone !== -1 ? "history" : "task"}
          />
          <LabelStatus taskCore={item} />
          <div
            style={{
              backgroundColor:
                item.params.identities.length > 0
                  ? item.params.identities[0].color
                  : "inherit"
            }}
            className="h-[20px] rounded-full w-[20px] mr-3"></div>
        </div>
      </div>
    </div>
  )
}
