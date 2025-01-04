import { useState } from "react"

import { usePersistContext } from "~contexts/persisting-context"

import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"
import { DraftList } from "./list-draft"
import HistoryList from "./list-history"
import { UpcommingList } from "./list-upcomming"

const tabs = ["Upcomming", "Drafts", "Recents"]

export default function Inbox({ show, setHide }) {
  const { storageLoading } = usePersistContext()
  const [activeTab, setActiveTab] = useState("Upcomming")

  return (
    <div
      dir="rtl"
      className="absolute w-full h-full px-4 bg-white/80 transition-all duration-200">
      {/* non-scrollables */}
      {!show && (
        <div
          onClick={() => setHide(false)}
          className="cursor-pointer w-full flex items-center justify-center">
          <Handle />
        </div>
      )}
      {show && (
        <div dir="ltr" role="tablist" className="w-full flex gap-2 px-11 py-6">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab)}
              className={`text-xs border-b-2 py-1 ${activeTab === tab ? "text-zinc-700 border-pink-500" : "text-zinc-400 border-transparent"}`}
              key={tab}>
              {tab}
            </button>
          ))}
        </div>
      )}
      {/* non-scrollables */}
      <div
        className={`relative styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-4`}>
        {/* <a href="#other">OTHER</a> */}

        <div dir="ltr" className="relative px-4 mb-4">
          {!show && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )}
          {storageLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loading r={20} color="#aaaaaa" />
            </div>
          ) : (
            <>
              {activeTab === "Upcomming" && <UpcommingList />}
              {activeTab === "Drafts" && <DraftList />}
              {activeTab === "Recents" && <HistoryList />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
