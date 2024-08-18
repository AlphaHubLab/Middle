import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { IBookmark, IBookmarks } from "~lib/types"
import { FETCH_STALE_TIME } from "~middle.config"
import { mockBookmark } from "~mock/mock-data"

import Bookmark from "./bookmark"

export default function BookmarkContainer() {
  const [fetchedBookmarks, setFetchedBookmarks, { remove }] = useStorage<{
    lastUpdate: number
    bookmarks: IBookmarks
  }>(
    {
      key: "middle-bookmarks",
      instance: new Storage({
        area: "local"
      })
    },
    (v) => {
      const currentTimestamp = new Date().getTime() / 1000

      if (!v || v.lastUpdate < currentTimestamp - FETCH_STALE_TIME)
        return { lastUpdate: currentTimestamp, bookmarks: null }

      return v
    }
  )

  useEffect(() => {
    if (!fetchedBookmarks) return
    if (fetchedBookmarks.bookmarks) return

    /**
     * for dev only when we don't have api
     */
    const bookmarks = mockBookmark
    setFetchedBookmarks({ ...fetchedBookmarks, bookmarks })
    /**
     *
     */

    /**
     * for production
     */

    // async function fetchBookmarks() {
    //   try {
    //     const response = await fetch(
    //       "https://api.middle.xyz/some/api" // replace this with api path
    //     )
    //     const bookmarks = await response.json()
    //     setFetchedBookmarks({ ...fetchedBookmarks, bookmarks })
    //   } catch (err) {
    //     console.error(err.message)
    //   }
    // }
    //
    // fetchBookmarks()
  }, [fetchedBookmarks])

  return (
    <div>
      {fetchedBookmarks.bookmarks && (
        <div className="">
          {Object.keys(fetchedBookmarks.bookmarks)?.map((category, i) => (
            <div className="p-2" key={`category_${i}`}>
              <h2 className="pb-1 text-xl font-bold border-b border-zinc-600 mb-4">{category}</h2>
              <div className="flex gap-2 justify-start">
                {fetchedBookmarks.bookmarks[category].map((b, i) => (
                  <div className={"grow-0 w-24 p-2"} key={`Bookmark_${i}`}>
                    <Bookmark bookmark={b} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="my-2">
        <p className="text-xs text-rose-500">for dev purposes</p>
        <button
          className="text-rose-500 border border-rose-500 rounded-lg p-1 hover:bg-gray-200 border-"
          onClick={() => remove()}>
          reset storage
        </button>
      </div>
    </div>
  )
}
