import React, { Children } from "react"

export default function WidgetGrid({ col, row, offset, children }) {
  const container = React.useRef(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    const cw = container.current.getBoundingClientRect().width
    setHeight((cw - (col + 1) * offset) / col)
  }, [])

  const childs = Children.toArray(children)

  return (
    <div
      ref={container}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${col}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${row}, minmax(0, ${height}px))`,
        gap: `${offset}px`,
        padding: `${offset}px`
      }}>
      {childs.map((c: React.ReactElement, i) => (
        <div
          key={`widget-${i}`}
          style={{
            // Alternative 2
            // display: "contents"
            gridColumn: `span ${c.props.w} / span ${c.props.w}`,
            gridRow: `span ${c.props.h} / span ${c.props.h}`
          }}>
          {c}
        </div>
      ))}
    </div>
  )
}

export const Wid = ({ children, shape = "rect", w, h }) => {
  // w = w ? w : 1
  // h = h ? h : 4
  return (
    <div
      // style={{
      //   gridColumn: `span ${colSpan} / span ${colSpan}`,
      //   gridRow: `span ${rowSpan} / span ${rowSpan}`
      // }}
      className={`w-full h-full bg-[#F7F7F7] flex items-center justify-center ${shape === "circle" ? "rounded-full" : "rounded-lg"}`}>
      {children}
    </div>
  )
}
