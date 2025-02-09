import {
  // PiFloppyDiskBack,
  PiLink,
  PiTextH,
  PiTextT,
  PiTimer
} from "react-icons/pi"

import type { IExtenstion, IIdentity } from "~lib/types"

export const GENERAL_EXTENTIONS: IExtenstion[] = [
  {
    icon: PiTextT,
    title: "Text",
    value: "p",
    action: "replaceNode",
    description: "Add a simple paragraph",
    keywords: ["write", "text", "paragraph"]
  },

  {
    icon: PiLink,
    title: "Link",
    value: "a",
    action: "replaceNode",
    description: "Add a link",
    keywords: ["link", "web", "site"]
  },

  {
    icon: PiTimer,
    title: "Date",
    value: 0,
    action: "addDate",
    description: "Add a due date",
    keywords: ["expire", "due"]
  },
  {
    icon: PiTimer,
    title: "Next 24H",
    value: 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in next 24H",
    keywords: ["24", "24h", "day", "date"]
  },
  {
    icon: PiTimer,
    title: "Next 7Days",
    value: 7 * 24 * 60 * 60 * 1000,
    action: "addDate",
    description: "Do in the next week",
    keywords: ["7", "7d", "week", "date"]
  },
  {
    icon: PiTimer,
    title: "Repeater",
    value: { type: "until", goal: 7, step: 24 * 60 * 60 * 1000 },
    action: "addRepeat",
    description: "Add a Repeater to your task",
    keywords: ["repeat", "date"]
  }
  // {
  //   icon: PiTimer,
  //   title: "Repeat 10 times",
  //   value: { type: "until", goal: 10, step: 24 * 60 * 60 * 1000 },
  //   action: "addRepeat",
  //   description: "Repeat 10 times until due date",
  //   keywords: ["repeat", "every day", "daily", "date"]
  // },
  // {
  //   icon: PiTimer,
  //   title: "Repeat Daily",
  //   value: { type: "from", goal: 10, step: 24 * 60 * 60 * 1000 },
  //   action: "addDate",
  //   description: "Repeat",
  //   keywords: ["repeat", "every day", "daily", "date"]
  // }

  // Todo
  // {
  //   icon: PiFloppyDiskBack,
  //   title: "Store",
  //   value: null,
  //   action: "persist",
  //   description: "Store",
  //   keywords: ["save", "store", "ok", "done"]
  // }
]

/**
 * Create Dynamic Command Extensions based on user identities
 * @param identities
 */
export const createIdentityExtenstions = (
  identities: IIdentity[]
): IExtenstion[] => {
  return identities.map((identity) => ({
    icon: () => <IdentityIcon color={identity.color} />,
    title: `Assign task to "${identity.label}"`,
    value: identity,
    action: "addIdentity",
    description: "Add the ID you want to do the task with",
    keywords: [
      "id",
      "identity",
      "assignee",
      identity.label,
      ...identity.items.map((item) => item.value)
    ]
  }))
}

const IdentityIcon = ({ color }: { color: string }) => (
  <div className="w-3 h-3 rounded-full" style={{ background: color }}></div>
)
