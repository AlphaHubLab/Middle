import React from "react"
import { CiSearch } from "react-icons/ci"

export default function NavbarContainer() {
  const [search, setSearch] = React.useState("")

  return (
    <nav className="relative w-full h-24 flex items-center justify-center gap-8 px-8">
      <a className="font-bold text-4xl" href="#">
        Fetch
      </a>
      <div className="w-full has-[:focus]:outline shadow-sm border rounded-lg h-6 flex gap-2 px-1 items-center justify-center h-fit">
        <CiSearch />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
          className="appearence-none leading-tight p-1 w-full outline-none"
        />
      </div>
      {search.length > 0 && (
        <div
          className={`z-10 absolute top-[96px] left-0 w-full bg-transparent h-screen p-2 flex justify-center backdrop-blur`}>
          <SearchPanel />
        </div>
      )}
    </nav>
  )
}

const SearchPanel = () => {
  const [style, setStyle] = React.useState({ opacity: 0 })

  React.useEffect(() => {
    style?.opacity === 0 && setStyle({ opacity: 1 })
  }, [style])

  return (
    <div
      style={style}
      className={`z-10 transform duration-200 bg-zinc-400/10 border border-zinc-200/50 transform duration-200 w-[650px] mx-auto rounded-lg h-[calc(75%-96px)] p-2 shadow-md`}>
      Search
    </div>
  )
}
