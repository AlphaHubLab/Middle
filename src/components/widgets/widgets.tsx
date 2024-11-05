import React, { Children } from "react"

export const WidgetContainer = () => {
  const [activeWidget, setActiveWidget] = React.useState("none")
  const [widgetState, setWidgetState] = React.useState({})
  const ref = React.useRef(null)
  const cloneStyle = (childBCR: any, borderRadius: any) => {
    // For getting width and hight also if needed
    // const parentBCR = ref?.current?.getBoundingClientRect();
    //@ts-ignore
    const { offsetTop: parentTop, offsetLeft: parentLeft } = ref.current

    // starting style
    const style = {
      position: "absolute",
      background: "#474747",
      transition: "all 200ms ease-out",
      top: Math.abs(childBCR.top - parentTop),
      left: Math.abs(childBCR.left - parentLeft),
      width: childBCR.width,
      height: childBCR.height,
      zIndex: "0",
      borderRadius
      // opacity: "20"
    }

    setWidgetState({ style, show: true })
  }
  return (
    <div ref={ref} className="w-full relative">
      {activeWidget !== "none" && (
        <OpenerElement
          setActiveWidget={setActiveWidget}
          state={widgetState}
          close={() => setWidgetState({ ...widgetState, show: false })}
        />
      )}
      <WidgetGrid col={4} row={8} offset={8}>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={4}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={2}
          h={2}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={2}
          h={2}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={2}
          h={2}
          shape="circle">
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={2}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={1}
          h={1}>
          1
        </Widget>
        <Widget
          name={1}
          cloner={cloneStyle}
          setter={setActiveWidget}
          w={4}
          h={2}>
          1
        </Widget>
        {/* <button onClick={() => setDisabled(true)}>show</button> */}
      </WidgetGrid>
    </div>
  )
}

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

export const Widget = ({
  children,
  name,
  setter,
  cloner,
  shape = "rect",
  w,
  h
}) => {
  const ref = React.useRef(null)
  // w = w ? w : 1
  // h = h ? h : 4
  return (
    <div
      // style={{
      //   gridColumn: `span ${w} / span ${w}`,
      //   gridRow: `span ${h} / span ${h}`
      // }}
      className={`flex w-full h-full items-center justify-center`}>
      <div
        ref={ref}
        onClick={() => {
          cloner(
            //@ts-ignore
            ref?.current?.getBoundingClientRect(),
            `${shape === "circle" ? "50%" : "8px"}`
          )

          setter(name)
        }}
        className={`cursor-pointer middle-btn-3 p-1 bg-[#2d2d2d] w-full h-full text-white ${shape === "circle" ? "rounded-full" : "rounded-lg"}`}>
        {/* {children} */}{" "}
      </div>
    </div>
  )
}

const OpenerElement = ({ state, setActiveWidget, close }: any) => {
  const [style, setStyle] = React.useState(state.style)
  const [showContent, setShowContent] = React.useState(false)

  React.useEffect(() => {
    if (style.top === "8px") return

    const transitionStyle = {
      ...state.style,
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(8px)",
      // opacity: "1",
      top: "8px",
      left: "8px",
      width: "calc(100% - 16px)",
      height: "calc(100% - 16px)",
      borderRadius: "8px"
    }

    setShowContent(true)
    setStyle(transitionStyle)
  }, [style])

  // React.useEffect(() => {
  //   if (showContent && state.show
  //   const timer = setTimeout(() => close(), 200)
  //   return () => clearTimeout(timer)
  // }, [showContent])

  const onClose = () => {
    setShowContent(false)
    const timer = setTimeout(() => close(), 80)
    return () => clearTimeout(timer)
    // close()
  }

  const onTransitionEnd = () => {
    // state.show === true && setShowContent(true)
    state.show === false && setActiveWidget("none")
  }

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      style={
        state.show
          ? style
          : // Back to the starting style
            // override background to un-hovered
            {
              ...state.style,
              background: "#2d2d2d"
            }
      }>
      <div
        className={`p-4 transition-all duration-200 ${showContent ? "delay-[80ms] opacity-100" : "opacity-0"}`}>
        <button onClick={onClose} className="text-white/50">
          {"<-"}
        </button>
        <div className="flex flex-col px-4 text-white/50">
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
          <div>bla</div>
        </div>
      </div>
    </div>
  )
}
