import { IoFilterCircleOutline } from "react-icons/io5"
import { MdFilterHdr } from "react-icons/md"

import type { IExtenstion, IIdentity } from "~lib/types"

export const GENERAL_EXTENTIONS: IExtenstion[] = [
  {
    icon: MdFilterHdr,
    title: "Add Title",
    value: "h",
    action: "addNode",
    description: "Add a main title",
    keywords: ["header", "title"]
  },
  {
    icon: MdFilterHdr,
    title: "Text",
    value: "p",
    action: "replaceNode",
    description: "Add a simple paragraph",
    keywords: ["write", "text", "paragraph"]
  },

  {
    icon: IoFilterCircleOutline,
    title: "Link",
    value: "a",
    action: "replaceNode",
    description: "Add a link",
    keywords: ["link", "web", "site"]
  },

  {
    icon: MdFilterHdr,
    title: "Date",
    value: 0,
    action: "addDate",
    description: "Add a due date",
    keywords: ["expire", "due"]
  },
  {
    icon: MdFilterHdr,
    title: "Next 24H",
    value: 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in next 24H",
    keywords: ["24", "24h", "day", "date"]
  },
  {
    icon: MdFilterHdr,
    title: "Next 7Days",
    value: 7 * 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in the next week",
    keywords: ["7", "7d", "week", "date"]
  },
  {
    icon: MdFilterHdr,
    title: "Store",
    value: null,
    action: "persist",
    description: "Store",
    keywords: ["save", "store", "ok", "done"]
  }
]

/**
 * Create Dynamic Command Extensions based on user inputed identities
 * @param identities
 */
export const createIdentityExtenstions = (
  identities: IIdentity[]
): IExtenstion[] => {
  return identities.map((identity) => ({
    icon: () => <IdentityIcon color={identity.color} />,
    title: `Assign ${identity.label} to task`,
    value: identity,
    action: "addIdentity",
    description: "Assign identity",
    keywords: ["id", "identity", ...identity.items.map((item) => item.key)]
  }))
}

const IdentityIcon = ({ color }) => (
  <div className="w-3 h-3 rounded-full" style={{ background: color }}></div>
)
