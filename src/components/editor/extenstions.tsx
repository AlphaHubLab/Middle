import { IoFilterCircleOutline } from "react-icons/io5"
import { MdFilterHdr } from "react-icons/md"

import type { Extenstion } from "~lib/types"

export const extensions: Extenstion[] = [
  {
    icon: MdFilterHdr,
    title: "Add Title",
    value: "h",
    action: "addNode",
    description: "Add a main title",
    keywords: ["header", "title"]
    // run: () => console.log("run pen")
  },
  {
    icon: MdFilterHdr,
    title: "Text",
    value: "p",
    action: "replaceNode",
    description: "Add a simple paragraph",
    keywords: ["write", "text", "paragraph"]
    // run: () => console.log("run pen")
  },

  {
    icon: IoFilterCircleOutline,
    title: "Link",
    value: "a",
    action: "replaceNode",
    description: "Add a link",
    keywords: ["link", "web", "site"]
    // run: () => console.log("run apple")
  },

  {
    icon: MdFilterHdr,
    title: "Date",
    value: 0,
    action: "addDate",
    description: "Add a due date",
    keywords: ["expire", "due"]
    // run: () => console.log("run Cae")
  },
  {
    icon: MdFilterHdr,
    title: "Next 24H",
    value: 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in next 24H",
    keywords: ["24", "24h", "day", "date"]
    // run: () => console.log("run Cae")
  },
  {
    icon: MdFilterHdr,
    title: "Next 7Days",
    value: 7 * 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in the next week",
    keywords: ["7", "7d", "week", "date"]
    // run: () => console.log("run Cae")
  }
]
