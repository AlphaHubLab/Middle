import { startTransition, useEffect, useState, useTransition } from "react"
import { CiSearch } from "react-icons/ci"

import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"
import { getDetailedPreview as gdp } from "~lib/task-helpers"
import type { ITaskCore } from "~lib/types"

// import { mockTask } from "~mock/mock-tasks"

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
        <div
          className={`z-10 absolute top-[96px] left-0 w-full bg-transparent h-screen p-2 flex justify-center backdrop-blur`}>
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

  // const s = () => {
  //   startTransition(() => {
  //     const taskResults =
  //       search.trim().length === 0 ? [] : searching(search, taskStorage)
  //     const historyResults =
  //       search.trim().length === 0 ? [] : searching(search, history)
  //     const draftsResults =
  //       search.trim().length === 0 ? [] : searching(search, drafts)
  //     setData({
  //       taskResults,
  //       historyResults,
  //       draftsResults
  //     })
  //   })
  // }
  // useEffect(() => {
  //   s()
  // }, [search])

  const taskResults = search.trim().length === 0 ? [] : searching(search, tasks)
  const historyResults =
    search.trim().length === 0 ? [] : searching(search, history)
  const draftsResults =
    search.trim().length === 0 ? [] : searching(search, drafts)

  // const { draftsResults, historyResults, taskResults } = data
  // console.log(data)
  return (
    <div
      style={style}
      className={`z-10 flex flex-col transform duration-200 bg-zinc-400/10 border border-zinc-200/50 transform duration-200 w-[650px] mx-auto rounded-lg h-[calc(75%-96px)] p-2 shadow-md`}>
      <div className="w-full">
        <button onClick={onClose}>x</button>
      </div>
      <p className="border-b-[1px] font-bold mb-2">Searching for: {search}</p>

      <div className="h-full overflow-y-auto styled-scrollbar">
        {taskResults.length === 0 &&
          draftsResults.length === 0 &&
          historyResults.length === 0 && <div>Not {"f(ound)"}</div>}
        {taskResults.length > 0 && (
          <div className="py-4">
            <h2 className="border-b-[1px] text-zinc-600">Tasks</h2>
            {taskResults.map((r, i) => {
              const preview = gdp(r.nodes)
              return (
                <div
                  key={`task-search-${i}`}
                  className="border-b-[1px] text-xs p-2 hover:bg-zinc-400/30">
                  <p className="font-bold text-zinc-700">{preview[0].value}</p>
                  <p className="text-zinc-700">{preview[1].value}</p>
                </div>
              )
            })}
          </div>
        )}
        {draftsResults.length > 0 && (
          <div className="py-4">
            <h2 className="border-b-[1px] text-zinc-600">Drafts</h2>
            {draftsResults.map((r, i) => {
              const preview = gdp(r.nodes)
              return (
                <div
                  key={`draft-search-${i}`}
                  className="border-b-[1px] text-xs p-2 hover:bg-zinc-400/30">
                  <p className="font-bold text-zinc-700">{preview[0].value}</p>
                  <p className="text-zinc-700">{preview[11].value}</p>
                </div>
              )
            })}
          </div>
        )}
        {historyResults.length > 0 && (
          <div className="py-4">
            <h2 className="border-b-[1px] text-zinc-600">History</h2>
            {historyResults.map((r, i) => {
              const preview = gdp(r.nodes)
              return (
                <div
                  key={`history-search-${i}`}
                  className="border-b-[1px] text-xs p-2 hover:bg-zinc-400/30">
                  <p className="font-bold text-zinc-700">{preview[0].value}</p>
                  <p className="text-zinc-700">{preview[1].value}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
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
      // ex.value.match(searchKey) ||
      // item.task[0].value.match(searchKey) ||
      item.params.tags
        .map((t) => t.toLowerCase().match(searchKey))
        .filter((r) => r).length > 0 ||
      item.nodes
        .map((n) => n.value.toLowerCase().match(searchKey))
        .filter((r) => r).length > 0
  )
}
