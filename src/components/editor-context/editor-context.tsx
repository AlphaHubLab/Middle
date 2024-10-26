import uuid4 from "uuid4"

import { Provider, useStore } from "./context"

export default function EditorContext() {
  return (
    <Provider
      value={{
        amount: 1,
        id: uuid4(),
        task: [{ type: "h", value: "" }],
        range: 0,
        focusedNode: 0,
        params: { dueDate: -1, tags: [] }
      }}>
      <Ed />
    </Provider>
  )
}

interface Store {
  id: string
  task: any[]
  range: number
  focusedNode: number
}

function Ed() {
  const state = useStore() as Store

  return (
    <div className="flex flex-col">
      {Array.from({ length: state.amount }).map((_, i) => (
        <Input className="border" key={`i_${i}`} index={i} />
      ))}
    </div>
  )
}

const Input = ({ index, ...props }) => {
  const state = useStore()
  console.log(`${index}`)
  const onKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault()
      state.amount = state.amount + 1
      const newTask = state.task.toSpliced(i + 1, 0, { type: "p", value: "" })
      state.task = newTask
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      if (
        e.target.selectionStart === 0 &&
        e.target.selectionEnd === 0 &&
        e.target.value.length === 0
      ) {
        e.preventDefault()
        const newTask = state.task.toSpliced(i, 1)
        state.task = newTask
      }
    }
  }

  const handleChangeInput = (e, i) => {
    const task = [...state.task]
    task[i].value = e.target.value
    state.task = task
  }

  return (
    <input
      {...props}
      onKeyDown={(e) => onKeyDown(e, index)}
      onChange={(e) => handleChangeInput(e, index)}
      value={state.task[index].value}
    />
  )
}
