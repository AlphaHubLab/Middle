import type { INode, ITask, ITaskParams } from "~lib/types"

const mockNodes = [
  [
    { type: "p", value: "Blah Blah" },
    { type: "a", value: "https://tockable.com" },
    { type: "p", value: "Blah Blah" }
  ],
  [
    { type: "p", value: "Foo Bar" },
    { type: "p", value: "Foo Bar" },
    { type: "p", value: "Foo Bar" }
  ],
  [{ type: "a", value: "https://google.com" }],
  [
    { type: "p", value: "Do nothing!" },
    { type: "p", value: "Do nothing!" },
    { type: "p", value: "Do nothing!" },
    { type: "p", value: "Do nothing!" },
    { type: "p", value: "Do nothing!" }
  ]
]

export const mockTask: ITask[] = [
  ...(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: `${i}`,
      done: false,
      dateAdded: new Date().getTime(),
      params: {} as ITaskParams,
      nodes: [
        { type: "h", value: `task ${i}` },
        mockNodes[Math.floor(Math.random() * mockNodes.length)]
      ] as INode[]
    })))()
]
