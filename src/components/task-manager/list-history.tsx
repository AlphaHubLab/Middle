import { DateTime } from "luxon"
import { useEffect, useMemo, useState } from "react"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
import { LabelStatus, TimeStatus } from "~components/editor/status"
import * as C from "~components/ui/collapsible"
import { usePersistContext } from "~contexts/persisting-context"
import { useSettingContext } from "~contexts/setting-context"
import { fetchconfig } from "~fetch.config"
import { getUpcommingPreview } from "~lib/task-helpers"
import type { IHistory } from "~lib/types"

import InboxItemWrapper from "./inbox-item-wrapper"
import { TaskGroup } from "./task-group"

const ONE_DAY = 24 * 60 * 60 * 1000

const createHistoryList = (
  history: IHistory[],
  dayLimit = 7,
  timeZone: string
) => {
  const sortedWithLabels: Record<string, IHistory[]> = {}

  const today = DateTime.now().setZone(timeZone).startOf("day").millisecond

  // const sorted = history.reverse()
  const sorted = [...history].sort((a, b) => b.dateDone - a.dateDone)
  for (let i = 0; i < sorted.length; i++) {
    // Exit early if there is a day Limit and dateDone is out of the range
    if (dayLimit !== 0 && sorted[i].dateDone < today - dayLimit * ONE_DAY) {
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

  const { history } = usePersistContext()
  const { setting } = useSettingContext()

  const historyList = useMemo(
    () => createHistoryList(history, dayLimit, setting.preferredTimeZone),
    [history]
  )

  if (historyList) {
    return (
      <div>
        {Object.keys(historyList).map((groupName) => (
          <div key={`history-${groupName}`}>
            <TaskGroup label={groupName} value={groupName} labelType="neutral">
              {historyList[groupName].map((item) => (
                <div key={`${item.id}`}>
                  <HistoryItem item={item} />
                </div>
              ))}
            </TaskGroup>
          </div>
        ))}
      </div>
    )
  }

  return false
}

const HistoryItem = ({ item }) => {
  const { handleUndone } = usePersistContext()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px"
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: fetchconfig.timers.undone + "s"
  })

  const handleUncheck = (e) => {
    if (e.target.checked) {
      setTimerStyle({
        width: "0%",
        transitionDuration: fetchconfig.timers.cancel + "s"
      })
    } else {
      setTimerStyle({
        width: "100%",
        transitionDuration: fetchconfig.timers.undone + "s"
      })
    }
  }

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(
      () => handleUndone(item.id),
      fetchconfig.timers.undone * 100
    )
    return () => timer && clearTimeout(timer)
  }, [hidingStyle])

  const slide = () => {
    timerStyle.width === "100%" &&
      setHidingStyle({
        transform: "translateX(200%)",
        maxHeight: "0px"
      })
  }

  return (
    <div style={hidingStyle} className="transition-all py-1">
      <InboxItemWrapper>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Checkbox>
            <div
              className={`flex w-8 h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"}`}>
              <input defaultChecked type="checkbox" onChange={handleUncheck} />
            </div>
          </C.Checkbox>
          <C.Toggle>
            <div
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div
                onTransitionEnd={slide}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-blue-200 "></div>
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <h2 className="font-bold text-sm flex-auto px-2">
                  {getUpcommingPreview(item.nodes).value}
                </h2>
                <TimeStatus item={item} itemType="history" />
                <LabelStatus taskCore={item} />
              </div>
            </div>
          </C.Toggle>
          <C.Content>
            <div className="flex">
              <div className="w-8"></div>
              <div className="overflow-y-auto styled-scrollbar h-content max-h-[176px] w-full">
                <div className="flex gap-2 px-2 py-2 w-full">
                  <RenderAllElementsReadOnlyWithCopy taskCore={item} />
                </div>
              </div>
            </div>
          </C.Content>
          <C.Toolbar>
            <div className="bg-zinc-100 w-full border-t-[1px] h-[24px] flex items-center">
              {/* <TaskToolbar item={item} type={type} /> */}
            </div>
          </C.Toolbar>
        </C.CollapsibleForTasks>
      </InboxItemWrapper>
    </div>
  )
}
