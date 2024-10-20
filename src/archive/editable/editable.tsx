import { useEffect, useRef, useState } from "react"

function setCursorEditable(editableElem, position) {
  //   console.log(editableElem.childNodes[0])

  //   position = 0
  //   console.log(position)
  let range = document.createRange()
  let sel = window.getSelection()
  range.setStart(editableElem.childNodes[0], position)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
  editableElem.focus()
}

export default function Editable() {
  const [task, setTask] = useState([
    [
      { type: "p", text: "hey" },
      { type: "p", text: "you" }
    ],
    [{ type: "p", text: "dude" }]
  ])

  const refs = useRef([[]])
  const [pos, setPos] = useState({ i: 0, j: 0 })

  const addToRef = (el, pos) => {
    if (el) {
      //   refs?.current?.push(el)
      if (refs.current[pos.i]) {
        refs?.current[pos.i].push(el)
      } else {
        refs.current.push([el])
      }
    }
  }

  const setNode = (e, pos) => {
    // console.log(e.target.innerText)
    const _task = [...task]
    _task[pos.i][pos.j].text = e.target.innerText
    setTask(_task)
    setPos(pos)
  }

  useEffect(() => {
    if (task[pos.i][pos.j].text.length === 0) return
    setCursorEditable(
      refs.current[pos.i][pos.j],
      task[pos.i][pos.j].text.length - 1
    )
  }, [pos])

  return (
    <div>
      {task.map((t, i) => (
        <div key={`p_${i}`}>
          {t.map((child, j) => (
            <span key={`child_${i}_${j}`}>
              <RenderElements
                addToRef={addToRef}
                setNode={setNode}
                child={child}
                position={{ i, j }}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

const Span = ({ child, addToRef, setNode, position }) => {
  //     console.log(child)
  //   useEffect(() => {
  //     if()
  //     setCursorEditable(document.activeElement, child.text.length - 1)
  //   }, [child])

  return (
    <span ref={addToRef} onInput={(e) => setNode(e, position)} contentEditable>
      {child.text}
    </span>
  )
}

const RenderElements = ({ addToRef, child, setNode, position }) => {
  if (child.type === "p")
    return (
      <Span
        child={child}
        addToRef={(el) => addToRef(el, position)}
        setNode={setNode}
        position={position}
      />
    )

  //   if (child.type === "a") return <a contentEditable>{child.text}</a>
  return <span>asdf</span>
}
