import { useEffect, useState } from "react"
import {
  PiArrowLeft,
  PiArrowRight,
  PiArrowSquareOut,
  PiCalendarCheck
} from "react-icons/pi"

import { sendToBackground } from "@plasmohq/messaging"

import { FETCH_API } from "~fetch.config"

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
// import { FETCH_API } from "~fetch.config"

export default function Sidebar({ isDev = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState({})
  // Should be fetched from the server

  useEffect(() => {
    ;(async () => {
      // const resp = await sendToBackground({
      //   name: "test",
      //   body: {
      //     id: 123
      //   }
      // })

      // const res = await sendToBackground({ name: "available-apps" })
      // console.log(res)
      // setBookmarks(res)

      try {
        const response = await fetch(`${FETCH_API}/available-bookmarks`)

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
      className={`fixed h-[calc(100%-3rem)] top-12 right-0 w-[286px] transition-[margin-right] duration-200 ${isOpen ? "mr-0" : "-mr-[222px] md:mr-0"} z-20`}>
      <div
        className={`relative w-full h-full py-2 z-30 bg-slate-50 border-l border-black/15`}>
        <div className="w-full h-full ">
          <div className="h-[calc(100%-200px)]">
            <div className="w-full py-1 px-1 md:px-2 flex items-center gap-2">
              <div className="w-[54px] h-[54px] border rounded-2xl flex items-center justify-center text-fetch-primary text-2xl">
                <PiCalendarCheck />
              </div>
            </div>
            <>
              {Object.keys(bookmarks).map((group, i) => (
                <div className="py-4 px-1 md:px-2" key={`bookmark-group-${i}`}>
                  {bookmarks[group].map((bookmark, j) => (
                    <Bookmark key={`bookmark-${i}-${j}`} {...bookmark} />
                  ))}
                </div>
              ))}
            </>
          </div>
        </div>
        <div className="w-full py-1 px-1 flex absolute bottom-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
            className="hover:bg-violet-100 visible md:hidden w-[54px] h-[54px] flex items-center justify-center md:w-full bg-slate-50 border border-violet-900 rounded-2xl text-2xl text-fetch-primary">
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
