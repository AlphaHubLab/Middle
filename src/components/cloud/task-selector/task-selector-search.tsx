import { SearchResults } from "~components/search/search"
import { TaskGroup } from "~components/task-manager/inbox/task-group"

import { SelectableItem } from "./task-selector-items"

export default function TaskSelectorSearch({
  search,
  handleSelectItems,
  selectedItems
}) {
  return (
    <div className="w-full">
      {search.length < 2 ? (
        <p className="text-black/50 text-sm text-center w-full">
          Please type at least 2 letters.
        </p>
      ) : (
        <SearchResults search={search}>
          {(result) => (
            <>
              <TaskGroup variant="neutral" label="Tasks" value="tasks">
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
              <TaskGroup variant="neutral" label="history" value="history">
                {result.historyResults.map(
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
              <TaskGroup variant="neutral" label="Drafts" value="drafts">
                {result.draftsResults.map(
                  (item, i) =>
                    i < 5 && (
                      <SelectableItem
                        key={item.id}
                        setSelectedItems={handleSelectItems}
                        //@ts-ignore
                        item={item}
                        isSelected={selectedItems.includes(item.id)}
                      />
                    )
                )}
              </TaskGroup>
            </>
          )}
        </SearchResults>
      )}
    </div>
  )
}
