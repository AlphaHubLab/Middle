import uuid4 from "uuid4"

import type { INode, ITask, ITaskParams } from "~lib/types"

import { mockIdentities } from "./mock-identities"

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
      id: uuid4(),
      done: false,
      dateAdded: new Date().getTime(),
      dateDone: -1,
      reference: "",
      params: {
        tags: [],
        identities:
          Math.random() > 0.5
            ? []
            : Math.random() > 0.5
              ? [mockIdentities[0]]
              : [mockIdentities[1]],
        dueDate:
          new Date().getTime() +
          Math.random() * 7 * Math.random() * 24 * 60 * 60 * 1000
      } as ITaskParams,
      nodes: [
        { type: "h", value: `task ${i}` },
        ...mockNodes[Math.floor(Math.random() * mockNodes.length)]
      ] as INode[]
    })))()
]
