import type { IBookmarks } from "~lib/types"

export const mockBookmark: IBookmarks = {
  hot: [
    { name: "hot1", url: "google.com", icon: "icon.png" },
    { name: "hot2", url: "google.com", icon: "icon.png" },
    { name: "hot3", url: "google.com", icon: "icon.png" }
  ],

  "keep safe": [
    {
      name: "Pocket Universe",
      url: "pocketuniverse.app",
      icon: "icon.png"
    },
    {
      name: "Safe",
      url: "safe.global",
      icon: "icon.png"
    }
  ],
  "explore more": [
    { name: "Galxe", url: "galxe.com", icon: "icon.png" },
    { name: "Layer3", url: "layer3.xyz", icon: "icon.png" }
  ]
}
