import { useState } from "react"

import { usePersist } from "~contexts/persist-context"

import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"
import { DraftList } from "./list-draft"
import HistoryList from "./list-history"
import { UpcommingList } from "./list-upcomming"

const tabs = ["Upcomming", "Drafts", "Recents", "Notes"]

export default function Inbox({ show, setHide }) {
  const { storageLoading } = usePersist()
  const [activeTab, setActiveTab] = useState("Upcomming")

  return (
    <div
      dir="rtl"
      className="relative w-full h-full px-1 sm:px-4 transition-all duration-200 border border-zinc-500 bg-white dark:bg-fetch-black rounded-xl">
      {/* non-scrollables */}
      {!show && (
        // <div className="relative w-full ">
        <div className="relative cursor-pointer w-full h-12">
          <div
            onClick={() => setHide(false)}
            className="absolute top-0 left-0 h-[200px] w-full flex items-start justify-center">
            <Handle />
          </div>
        </div>
        // </div>
      )}
      {show && (
        <div
          dir="ltr"
          role="tablist"
          aria-orientation="horizontal"
          className="w-full flex gap-2 px-5 sm:px-11 py-6">
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
        className={`styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-1 sm:px-4`}>
        {/* <a href="#other">OTHER</a> */}

        <div dir="ltr" className="px-1 sm:px-4 mb-4">
          {/* {!show && (
            <div className="absolute bg-white/50 h-full top-0 left-0 w-full"></div>
          )} */}
          {storageLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loading r={20} color="#aaaaaa" />
            </div>
          ) : (
            <div className="relative z-100">
              {activeTab === "Upcomming" && <UpcommingList />}
              {activeTab === "Drafts" && <DraftList />}
              {activeTab === "Recents" && <HistoryList />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
