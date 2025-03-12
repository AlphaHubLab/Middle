import { useEffect, useState } from "react"
import {
  PiArrowLeft,
  PiArrowRight,
  PiArrowSquareOut,
  PiCalendarHeartBold,
  PiCloudBold
} from "react-icons/pi"

import Loading from "~components/ui/loading"

const fetchApiUrl =
  process.env.PLASMO_PUBLIC_FETCH_API || "http://localhost:3000/api"

const defaultBookmarks = {
  sponsered: [
    {
      icon: "+",
      name: "default",
      description: "Something awesome",
      url: "#"
    },
    {
      icon: "+",
      name: "default",
      description: "Something awesome",
      url: "#"
    },
    {
      icon: "+",
      name: "default",
      description: "Something awesome",
      url: "#"
    }
  ],
  hot: [
    {
      icon: "+",
      name: "default",
      description: "Something awesome with max 55 character description",
      url: "#"
    },
    {
      icon: "+",
      name: "default",
      description: "Something awesome",
      url: "#"
    }
  ]
}

export default function Sidebar({ isDev = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState({})

  useEffect(() => {
    ;(async () => {
      try {
        // const res = await sendToBackground({ name: "available-apps" })
        // setBookmarks(res)
        const response = await fetch(`${fetchApiUrl}/available-bookmarks`)

        if (response.status === 201) {
          const bookmarks = await response.json()
          setBookmarks(bookmarks)
        }
        if (response.status === 400) {
          setBookmarks(defaultBookmarks)
        }
      } catch (err) {
        setBookmarks(defaultBookmarks)
      }
    })()
  }, [])

  return (
    <div
      className={`fixed h-[calc(100%-3rem)] py-1 md:pr-1 p-0 top-12 right-0 w-[286px] transition-[margin-right] duration-200 z-20 ${isOpen ? "mr-0" : "-mr-[222px] md:mr-0"}`}>
      <div
        className={`relative w-full h-full px-1 md:px-2 ${isOpen && "px-2"} z-30 bg-white shadow-none border rounded-l-3xl md:rounded-3xl border-transparent md:shadow-lg md:border-black/15`}>
        <div className="w-full h-full">
          <div className="h-[calc(100%-200px)]">
            <div className={`w-full py-2 flex items-center gap-2`}>
              <button
                // className for glossy effect
                // after:absolute after:content-[''] after:h-3/5 after:w-[calc(100%-6px)]
                // after:top-[2px] after:left-[3px] after:rounded-xl
                // after:bg-gradient-to-t after:from-white/0 after:to-white/60
                className="
                  relative flex shrink-0 items-center justify-center text-2xl text-white w-[54px] h-[54px] rounded-2xl 
                  bg-gradient-to-t from-emerald-200 to-green-400 shadow-[0px_0px_12px] shadow-green-300
                  border-t border-t-emerald-300 border-violet-100
                  transition-all duration-200
                  hover:scale-[1.05]
                  disabled:bg-none disabled:bg-zinc-300 disabled:shadow-none
                  disabled:border-none disabled:hover:rotate-0 disabled:hover:scale-100
              ">
                <PiCalendarHeartBold />
              </button>
              <div>
                <p className="text-black/80 text-sm font-medium flex gap-1 items-center">
                  Check-in!
                </p>
                <p className="text-black/50 flex gap-1 text-xs">
                  Collect points by submitting a check-in tx.
                </p>
              </div>
            </div>
            <div className={`w-full py-2 flex items-center gap-2`}>
              <a
                href={isDev ? "/clouddev" : "/tabs/cloud.html"}
                rel="noopener noreferrer"
                target="_blank"
                className="
                  relative border-t border-t-violet-500 border-violet-100
                  bg-gradient-to-t from-violet-500 to-fetch-primary
                  shadow-[0px_0px_12px] shadow-violet-400
                  transition-all duration-200
                  hover:scale-[1.05]
                  w-[54px] h-[54px] rounded-2xl text-white
                  flex items-center justify-center text-2xl
              ">
                <PiCloudBold />
              </a>
              <div>
                <p className="text-black/80 text-sm font-medium flex gap-1 items-center">
                  Fetch Cloud!
                </p>
                <p className="text-black/50 flex gap-1 text-xs">
                  Backup, restore and share your tasks!
                </p>
              </div>
            </div>
            <>
              {Object.keys(bookmarks).length === 0 && (
                <div
                  className={`${isOpen ? "w-full" : "w-[64px] md:w-full"} h-full flex items-center justify-center`}>
                  <Loading r={20} color="#0000005f" />
                </div>
              )}
              {Object.keys(bookmarks).map((group, i) => (
                <div className="py-4" key={`bookmark-group-${i}`}>
                  {bookmarks[group].map((bookmark, j) => (
                    <Bookmark key={`bookmark-${i}-${j}`} {...bookmark} />
                  ))}
                </div>
              ))}
            </>
          </div>
        </div>
        <div className={`w-full py-1 md:px-2 ${isOpen && "px-2"} flex absolute bottom-2`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
            className="hover:bg-violet-100 visible md:hidden w-[54px] h-[54px]
              flex items-center justify-center md:w-full bg-slate-50 border border-violet-900
              rounded-2xl text-2xl text-fetch-primary">
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
          className="md:hidden fixed w-full h-full top-0 left-0 bg-black/20"></div>
      )}
    </div>
  )
}

const Bookmark = ({ icon, name, description, url }) => {
  return (
    <div className="w-full py-1 flex items-center gap-1 md:gap-2 text-sm text-fetch-primary">
      <a
        href={url}
        className="shrink-0 w-[54px] h-[54px] border border-black/15 rounded-2xl text-2xl flex items-center justify-center">
        {icon}{" "}
      </a>
      <div>
        <p className="text-black/80 font-medium flex gap-1 items-center">
          {name}
          <span className="text-medium text-fetch-primary">
            <PiArrowSquareOut />
          </span>
        </p>
        <p className="text-black/50 flex gap-1 text-xs">{description}</p>
      </div>
    </div>
  )
}
