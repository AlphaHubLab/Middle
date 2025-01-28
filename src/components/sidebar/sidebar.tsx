import { useState } from "react"
import { PiArrowLeft, PiArrowRight, PiArrowSquareOut } from "react-icons/pi"

export default function Sidebar({ isDev = false }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`fixed h-[calc(100%-4rem)] top-16 right-0 w-[288px] transition-[margin-right] duration-200 ${isOpen ? "mr-0" : "-mr-[224px] md:mr-0"} z-20`}>
      <div
        className={`relative w-full h-full py-2 z-30 bg-slate-50 rounded-tl-2xl border-t border-l border-fetch-primary`}>
        <div className="w-full h-full ">
          <div className="h-[calc(100%-200px)]">
            <div className="w-full py-1 px-2 flex items-center gap-2">
              <div className="w-[50px] h-[50px] bg-violet-50 border border-violet-900 shadow-[0px_3px] shadow-violet-300 rounded-2xl"></div>
              Something
            </div>
            <div className="py-4">
              <Bookmark />
              <Bookmark />
            </div>
            <div className="py-4">
              <Bookmark />
              <Bookmark />
              <Bookmark />
              <Bookmark />
            </div>
          </div>
        </div>
        <div className="w-full py-1 px-2 flex absolute bottom-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
            className="visible md:hidden w-[50px] h-[50px] flex items-center justify-center md:w-full bg-violet-50 border border-violet-900 shadow-[0px_3px] shadow-violet-300 rounded-2xl hover:shadow-none text-2xl text-fetch-primary">
            {isOpen ? <PiArrowRight /> : <PiArrowLeft />}
          </button>
        </div>
      </div>
      {/* <div
        onClick={() => setIsOpen(true)}
        className={`w-full h-full block absolute top-0 left-0 md:hidden z-50 ${!isOpen && "bg-transparent hover:bg-white/50"}`}></div> */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="block md:hidden fixed w-full h-full top-0 left-0 bg-black/20"></div>
      )}
    </div>
  )
}

const Bookmark = () => {
  return (
    <div className="w-full py-1 px-2 flex items-center gap-2 text-sm text-fetch-primary">
      <a
        href="#"
        className="w-[50px] h-[50px] border border-violet-900 shadow-[0px_3px] hover:shadow-none shadow-violet-300 rounded-2xl text-2xl flex items-center justify-center">
        +
      </a>
      Something Awsome <PiArrowSquareOut />
    </div>
  )
}
