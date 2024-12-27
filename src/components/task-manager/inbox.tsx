import { useState } from "react"

import { usePersistContext } from "~contexts/persisting-context"

import Loading from "../ui/loading/loading"
import { Handle } from "../ui/svgs/handle"
import HistoryList from "./list-history"
import { UpcommingList } from "./list-upcomming"

const tabs = ["Upcomming", "Recents"]

export default function Inbox({ show, setHide }) {
  const { storageLoading } = usePersistContext()
  const [activeTab, setActiveTab] = useState("Upcomming")

  return (
    <div
      dir="rtl"
      className="absolute w-full h-full px-4 bg-white/80 transition-all duration-200">
      {!show && (
        <div
          onClick={() => setHide(false)}
          className="cursor-pointer w-full flex items-center justify-center">
          <Handle />
        </div>
      )}
      <div
        className={`relative styled-scrollbar ${show ? "overflow-y-auto" : "overflow-y-hidden"} h-full px-4`}>
        {/* <a href="#other">OTHER</a> */}
        <div role="tablist" className="w-full flex gap-2">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab)}
              className="bg-red-100"
              key={tab}>
              {tab}
            </button>
          ))}
        </div>
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
              {activeTab === "Recents" && <HistoryList />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
