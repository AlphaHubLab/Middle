// import Icon from "url:assets/icon.png"
import Icon from "url:public/icon.png"

import type { IBookmark } from "~lib/types"

export default function Bookmark(props: { bookmark: IBookmark }) {
  return (
    <a
      className="hover:bg-zinc-500 rounded-xl flex flex-col justify-center items-center"
      href={`https://${props.bookmark.url}`}
      target="_blank"
      rel="noopener noreferrer">
      <img
        // mock icon
        src={Icon}
        // to get website actual icon
        // src={`https://www.google.com/s2/favicons?sz256&domain_url=${props.bookmark.url}`}

        width={64}
        height={64}
        alt={`${props.bookmark.name}'s icon`}
      />
      <p className="text-center">{props.bookmark.name}</p>
    </a>
  )
}
