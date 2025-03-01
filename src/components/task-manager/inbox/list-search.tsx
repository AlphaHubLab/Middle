// import Fuse from "fuse.js"
// import { useState } from "react"
// import { CiSearch } from "react-icons/ci"

// import { SearchResults } from "~components/search/search"
// import { useDraft } from "~contexts/draft-context"
// import { usePersist } from "~contexts/persist-context"

import { SearchResults } from "~components/search/search"

import { DraftItem, HistoryItem, UpcomingItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

export default function SearchList({ search }) {
  return (
    <div dir="ltr">
      <div className="pt-2 pb-4 px-2">
        <>
          {search.length < 2 && (
            <p className="text-sm w-full h-full items-center justify-center flex text-zinc-400">
              Need at least 2 letters to fetch
            </p>
          )}
          {search.length >= 2 && (
            <SearchResults search={search}>
              {(result) => (
                <div className="h-full overflow-y-auto styled-scrollbar p-2">
                  <TaskGroupWrapper messageType="search">
                    <TaskGroup variant="neutral" label="Tasks" value="tasks">
                      {result.taskResults.map(
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
                      {result.draftsResults.map(
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
                    <TaskGroup
                      variant="neutral"
                      label="History"
                      value="history">
                      {result.historyResults.map(
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
            </SearchResults>
          )}
        </>
      </div>
    </div>
  )
}
