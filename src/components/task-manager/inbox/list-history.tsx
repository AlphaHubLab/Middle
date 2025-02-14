import { DateTime } from "luxon"
import { useMemo, useState } from "react"

import { usePersist } from "~contexts/persist-context"
import { useSetting } from "~contexts/setting-context"
import { TIME } from "~lib/constants"
import type { ITask } from "~lib/types"

import { HistoryItem } from "../items/items"
import { TaskGroup, TaskGroupWrapper } from "./task-group"

const createHistoryList = (
  history: ITask[],
  dayLimit = 7,
  timeZone: string
) => {
  const sortedWithLabels: Record<string, ITask[]> = {}

  const today = DateTime.now().setZone(timeZone).startOf("day").millisecond

  const sorted = [...history].sort((a, b) => b.dateDone - a.dateDone)
  for (let i = 0; i < sorted.length; i++) {
    // Exit early if there is a day Limit and dateDone is out of the range
    if (
      dayLimit !== 0 &&
      sorted[i].dateDone < today - dayLimit * TIME.ONE_DAY
    ) {
      return sortedWithLabels
    }

    const label = DateTime.fromMillis(sorted[i].dateDone)
      .setZone(timeZone)
      .toFormat("LLL dd, yyyy")

    if (sortedWithLabels.hasOwnProperty(label)) {
      sortedWithLabels[label].push(sorted[i])
    } else {
      sortedWithLabels[label] = [sorted[i]]
    }
  }

  return sortedWithLabels
}

export default function HistoryList() {
  const [dayLimit, setDayLimit] = useState(7)

  const { history } = usePersist()
  const { setting } = useSetting()

  const historyList = useMemo(
    () => createHistoryList(history, dayLimit, setting.preferredTimeZone),
    [history]
  )

  if (historyList) {
    return (
      <TaskGroupWrapper>
        {Object.keys(historyList).map((groupName) => (
          <TaskGroup
            key={`history-${groupName}`}
            label={groupName}
            value={groupName}
            variant="neutral">
            {historyList[groupName].map((item) => (
              <HistoryItem key={`${item.id}`} item={item} />
            ))}
          </TaskGroup>
        ))}
      </TaskGroupWrapper>
    )
  }

  return false
}
