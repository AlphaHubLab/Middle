import { useState } from "react"
import {
  PiBoxArrowDown,
  PiClockCounterClockwise,
  PiNote,
  PiNotePencil
} from "react-icons/pi"

import { SearchBar } from "~components/search/search"
import { usePersist } from "~providers/persist-provider"

import Loading from "../../ui/loading"
import { Handle } from "../../ui/svgs/handle"
import DraftList from "./list-draft"
import HistoryList from "./list-history"
import NoteList from "./list-note"
import SearchList from "./list-search"
import { UpcomingList } from "./list-upcoming"

const tabs = [
  { title: "Upcoming", icon: PiBoxArrowDown },
  { title: "Drafts", icon: PiNotePencil },
  { title: "Completed", icon: PiClockCounterClockwise },
  { title: "Notes", icon: PiNote }
  // { title: "Search", icon: PiMagnifyingGlass },
  // { title: "Filter", icon: PiFunnel }
]

export default function Inbox({ show, setHide }) {
  const { storageLoading } = usePersist()
  const [activeTab, setActiveTab] = useState("Upcoming")
  const [search, setSearch] = useState("")

  return (
    <div
      dir="rtl"
      className="relative w-full h-full px-1 lg:px-4 transition-all duration-200 border bg-white border-black/15 dark:bg-fetch-black rounded-3xl">
      {/* non-scrollables */}
      {!show && (
        <div className="relative cursor-pointer w-full h-12">
          <div
            onClick={() => setHide(false)}
            className="absolute top-0 left-0 h-[200px] w-full flex items-start justify-center">
            <Handle />
          </div>
        </div>
      )}
      <div className={`${show ? "visible" : "invisible"}`}>
        <div
          dir="ltr"
          role="tablist"
          aria-orientation="horizontal"
          className="w-full flex gap-1 px-5 lg:px-11 pt-6">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab.title)}
              className={`border flex gap-2 items-center rounded-xl h-6 px-2 ${activeTab === tab.title ? "text-white bg-fetch-primary font-semibold" : "text-fetch-primary font-normal bg-inherit hover:bg-violet-100"}`}
              key={tab.title}>
              <span className="text-normal">{<tab.icon />}</span>
              <span
                className={`${activeTab === tab.title ? "flex" : "hidden"} sm:flex text-xs`}>
                {tab.title}
              </span>
            </button>
          ))}
        </div>
        <div dir="ltr" className="pl-5 pr-3 lg:pl-11 lg:pr-9">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onFocus={() => setActiveTab("Search")}
          />
        </div>
      </div>
      {/* non-scrollables */}
      <div
        className={`styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-1 lg:px-4 bg-inherit`}>
        {/* <a href="#other">OTHER</a> */}

        <div dir="ltr" className="px-1 lg:px-4 mb-4 bg-inherit">
          {storageLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loading r={20} color="#aaaaaa" />
            </div>
          ) : (
            <div className="relative z-100 bg-inherit">
              {activeTab === "Upcoming" && <UpcomingList />}
              {activeTab === "Drafts" && <DraftList />}
              {activeTab === "Completed" && <HistoryList />}
              {activeTab === "Notes" && <NoteList />}
              {activeTab === "Search" && <SearchList search={search} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
