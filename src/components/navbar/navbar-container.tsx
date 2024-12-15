import Fuse from "fuse.js"
import { useEffect, useMemo, useState, useTransition } from "react"
import { CiSearch } from "react-icons/ci"

import {
  TaskGroup,
  TaskItemWithSearchedWrapper,
} from "~components/tasks/tasklist"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { getDetailedPreview as gdp } from "~lib/task-helpers"
import type { ITaskCore } from "~lib/types"


export default function NavbarContainer() {
  const [search, setSearch] = useState("")
  // const [searchWord, setSearchWord] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  // const [isPending, startTransition] = useTransition()
  return (
    <nav className="relative w-full h-24 flex items-center justify-center gap-8 px-8">
      <a className="font-bold text-4xl" href="#">
        Fetch
      </a>
      <div className="w-full has-[:focus]:outline shadow-sm border rounded-lg h-6 flex gap-2 px-1 items-center justify-center h-fit">
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
                  <TaskItemWithSearchedWrapper item={item} type="task" />
                </div>
              )
            )
          })}
          {/* </TaskGroup> */}

          {/* <TaskGroup group={"Overdues"} name="overdue" isOverdue>
          {visibleTasks.overdue.map((t, i) => (
            <div className="py-1" key={`overdue-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup>
        <TaskGroup group={"So close!"} name="urgent">
          {visibleTasks.urgent.map((t, i) => (
            <div className="py-1" key={`urgent-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup>
        <TaskGroup group={"Next 24 Hours"} name="next24">
          {visibleTasks.next24.map((t, i) => (
            <div className="py-1" key={`next24-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup>
        <TaskGroup group={"Next 48 Hours"} name="next48">
          {visibleTasks.next48.map((t, i) => (
            <div className="py-1" key={`next48-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup>
        <TaskGroup group={"Unschaduled"} name="unschaduled">
          {visibleTasks.unschaduled.map((t, i) => (
            <div className="py-1" key={`unschaduled-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup>
        <TaskGroup group={"Other"} name="other">
          {visibleTasks.other.map((t, i) => (
            <div className="py-1" key={`other-${i}`}>
              <TaskItemWithUpcommingWrapper item={t} type="task" />
            </div>
          ))}
        </TaskGroup> */}
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
