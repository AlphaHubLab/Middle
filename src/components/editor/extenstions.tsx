import type { IconType } from "react-icons"
import { IoFilterCircleOutline } from "react-icons/io5"
import { LuListFilter } from "react-icons/lu"
import { MdFilterHdr } from "react-icons/md"

export interface Extenstion {
  icon: IconType
  title: string
  value: string
  keywords: Array<string>
}

export const extensions = [
  {
    icon: IoFilterCircleOutline,
    title: "Apple",
    value: "apple",
    keywords: ["sib", "fruit"]
  },
  {
    icon: MdFilterHdr,
    title: "Pen",
    value: "pen",
    keywords: ["write", "text"]
  },
  {
    icon: LuListFilter,
    title: "Cat",
    value: "cat",
    keywords: ["pet", "dummy"]
  },
  {
    icon: MdFilterHdr,
    title: "Car",
    value: "car",
    keywords: ["speed", "vehicle"]
  },
  {
    icon: IoFilterCircleOutline,
    title: "Dummy",
    value: "dummy",
    keywords: ["smart"]
  },
  {
    icon: LuListFilter,
    title: "Coffee",
    value: "coffee",
    keywords: ["drink", "tea"]
  }
]
