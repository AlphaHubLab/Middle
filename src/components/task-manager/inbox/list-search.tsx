import { useMemo } from "react"

import { SearchResults } from "~components/search/search"
import { getPreviewNodes } from "~lib/task-helpers"
import type { IRecurrence, ITaskCore } from "~lib/types"
import { useDraft } from "~providers/draft-context"
import { usePersist } from "~providers/persist-provider"
import { useRecurrence } from "~providers/recurrence-provider"

import { DraftItem, HistoryItem, UpcomingItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

const getFullTask = (item: ITaskCore, recurrences: IRecurrence[]) => {
  if (!item) return

  if (item.hasOwnProperty("recurrenceId") && item.recurrenceId.length !== 0) {
    const nodes = getPreviewNodes(item, recurrences)
    return { ...item, nodes }
  }

  return item
}

export default function SearchList({ search }) {
  const { drafts } = useDraft()
  const { tasks, history } = usePersist()
  const { recurrences } = useRecurrence()

  const replacedTasks = useMemo(() => {
    if (!tasks) return []
    const _tasks = []

    for (let i = 0; i < tasks.length; i++) {
      _tasks.push(getFullTask(tasks[i], recurrences))
    }

    return _tasks
  }, [tasks])

  const replacedHistory = useMemo(() => {
    if (!history) return []
    const _tasks = []

    for (let i = 0; i < history.length; i++) {
      _tasks.push(getFullTask(history[i], recurrences))
    }

    return _tasks
  }, [history])

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
            <SearchResults
              tasks={replacedTasks}
              history={replacedHistory}
              drafts={drafts}
              search={search}>
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
