import Fuse from "fuse.js"
import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"

import { RenderAllElementsReadOnlyWithCopy } from "~components/editor/render-element-readonly"
// import Status from "~components/editor/status"
// import { TaskToolbar } from "~components/task-manager/task-group"
// import {
//   TaskGroup,
//   TaskItemWithSearchedWrapper,
// } from "~components/tasks/tasklist"
import * as C from "~components/ui/collapsible"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { fetchconfig } from "~fetch.config"
import { getDetailedPreview } from "~lib/task-helpers"
import type { ITask, ITaskCore } from "~lib/types"

export const SearchedItemWrapper = ({ children }) => {
  return (
    <div
      className={`h-full border-b-[1px] hover:bg-zinc-300 flex flex-col justify-center`}>
      {children}
    </div>
  )
}

const SearchedItem = ({ type, item }) => {
  const { handleDone } = usePersistContext()

  const [show, setShow] = useState(false)

  const [hidingStyle, setHidingStyle] = useState({
    transform: "none",
    maxHeight: "1000px"
  })

  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: fetchconfig.timers.done + "s"
  })

  const handleCheck = (e) => {
    if (!e.target.checked) {
      setTimerStyle({
        width: "0%",
        transitionDuration: fetchconfig.timers.cancel + "s"
      })
    } else {
      setTimerStyle({
        width: "100%",
        transitionDuration: fetchconfig.timers.done + "s"
      })
    }
  }

  useEffect(() => {
    if (hidingStyle.maxHeight !== "0px") return
    const timer = setTimeout(
      () => handleDone(item.id),
      fetchconfig.timers.done * 100
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
      <div>
        <C.CollapsibleForTasks show={show} setShow={setShow}>
          <C.Action>
            <div
              className={`flex w-8 h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"}`}>
              <input type="checkbox" onChange={handleCheck} />
            </div>
          </C.Action>
          <C.Toggle>
            <div
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div
                onTransitionEnd={slide}
                style={timerStyle}
                className="absolute z-0 h-full left-0 top-0 transition-[width] ease-in bg-emerald-200 "></div>
              <div className="relative z-1 flex gap-2 items-center h-full px-2">
                <h2 className="font-bold text-sm flex-auto px-2">
                  {/* {getUpcommingPreview(item.nodes).value} */}
                </h2>
                {/* <TimeStatus item={item} itemType="task" />
                <LabelStatus taskCore={item} /> */}
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
      </div>
    </div>
  )
}

export default function NavbarContainer() {
  const [search, setSearch] = useState("")
  // const [searchWord, setSearchWord] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  // const [isPending, startTransition] = useTransition()
  return (
    <nav className="relative w-full h-24 flex items-center justify-center gap-8 px-8">
      {/* <a className="invisible lg:visible absolute left-10 top-6 font-bold text-4xl" href="#">
        Fetch
      </a> */}
      <div className="w-full max-w-[580px] mx-auto has-[:focus]:outline shadow-sm border rounded-lg h-6 flex gap-2 px-1 items-center justify-center h-fit">
        <CiSearch />
        <input
          id="search-bar"
          placeholder="F(ound) something..."
          onFocus={() => setShowSearch(true)}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            // setSearch(e.target.value)
            // startTransition(() => {
            //   setSearchWord(e.target.value)
            // })
          }}
          className="appearence-none leading-tight p-1 w-full outline-none"
        />
      </div>
      {showSearch === true && (
        <div className="w-full h-screen absolute top-[96px] left-0">
          <div
            onClick={() => setShowSearch(false)}
            className={`z-10 absolute top-0 left-0 w-full bg-white/50 h-screen p-2 flex justify-center backdrop-blur`}></div>
          {/* {isPending && <div>pends</div>} */}
          <SearchPanel search={search} onClose={() => setShowSearch(false)} />
        </div>
      )}
    </nav>
  )
}

const SearchPanel = ({ search, onClose }) => {
  const [style, setStyle] = useState({ opacity: 0 })

  // const [data, setData] = useState({
  //   taskResults: [],
  //   historyResults: [],
  //   draftsResults: []
  // })

  const { tasks, history } = usePersistContext()
  const { drafts } = useDraftContext()

  useEffect(() => {
    style?.opacity === 0 && setStyle({ opacity: 1 })
  }, [style])

  // const srch = () => {
  //   startTransition(() => {
  //    // searching...
  //     setData({
  //       taskResults,
  //       historyResults,
  //       draftsResults
  //     })
  //   })
  // }
  // useEffect(() => {
  //   srch
  // }, [search])

  const all = [...tasks, ...history, ...drafts]
  const fuse = new Fuse(all, {
    keys: ["nodes.value", "params.tags"],
    minMatchCharLength: 2
  })

  const results = fuse.search(search).map((s) => s.item)
  // const visibleTasks = filterTasks(taskResults)

  // const { draftsResults, historyResults, taskResults } = data
  // console.log(data)
  return (
    <div
      style={style}
      className={`relative z-20 flex flex-col transform duration-300 bg-zinc-400/10 border border-zinc-200/50 transform duration-200 w-[650px] mx-auto rounded-lg h-[calc(75%-96px)] p-2 shadow-md`}>
      <div className="w-full">
        <button onClick={onClose}>x</button>
      </div>
      {search.length < 2 && (
        <p className="text-sm w-full h-full items-center justify-center flex text-zinc-400">
          Please type at least 2 chars
        </p>
      )}

      {search.length >= 2 && (
        <div className="h-full overflow-y-auto styled-scrollbar p-2">
          {results.length === 0 && (
            <div className="text-sm w-full h-full items-center justify-center flex text-zinc-400">
              Not {"F(ound) any :("}
            </div>
          )}
          {/* <TaskGroup group={"Tasks"} name="top" bg={false}> */}
          {results.map((item, i) => {
            return (
              i < 10 && (
                <div className="py-1" key={`overdue-${i}`}>
                  <SearchedItem item={item} type="task" />
                </div>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}

// This is a simple search
// Searching can be replaced with fusejs for fuzzy search if needed
// https://www.fusejs.io/
const searching = (str: string, storage: ITaskCore[]) => {
  if (str.match(/\/|\\|\*|\[|\]|\(|\)|\+|\?|\:|\^|\$|\|/g)) {
    return []
  }

  const searchKey = new RegExp(str.trim().toLowerCase(), "g")
  // let b = 0

  // for (let i = 0; i < 100000000; i++) {
  //   b = b + i
  // }

  return storage.filter(
    (item) =>
      item.params.tags
        .map((t) => t.toLowerCase().match(searchKey))
        .filter((r) => r).length > 0 ||
      item.nodes
        .map((n) => n.value.toLowerCase().match(searchKey))
        .filter((r) => r).length > 0
  )
}
