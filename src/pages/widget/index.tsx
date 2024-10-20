"use client"

import { useEffect, useRef, useState } from "react"

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="mt-2">
        <WigetContainer />
      </div>
    </div>
  )
}

const WigetContainer = () => {
  const [activeWidget, setActiveWidget] = useState("none")
  const [widgetState, setWidgetState] = useState({})
  const ref = useRef(null)

  const cloneStyle = (childBCR: any, borderRadius: any) => {
    // For getting width and hight also if needed
    // const parentBCR = ref?.current?.getBoundingClientRect();
    //@ts-ignore
    const { offsetTop: parentTop, offsetLeft: parentLeft } = ref.current

    const style = {
      position: "absolute",
      background: "#f4f4f5",
      transition: "all 0.25s ",
      top: Math.abs(childBCR.top - parentTop),
      left: Math.abs(childBCR.left - parentLeft),
      width: childBCR.width,
      height: childBCR.height,
      zIndex: "0",
      borderRadius
    }

    setWidgetState({ style, show: true })
  }

  return (
    <div>
      <button onClick={() => setWidgetState({ ...widgetState, show: false })}>
        Close
      </button>
      <div
        ref={ref}
        className="w-[400px] h-[596px] shadow-lg rounded-lg p-[4px] relative bg-black">
        {activeWidget !== "none" && (
          <OpenerElement
            setActiveWidget={setActiveWidget}
            state={widgetState}
          />
        )}
        <div className="flex ">
          <div className="p-[4px] h-[196px] w-full ">
            <Widget
              name={"circle"}
              setActiveWidget={setActiveWidget}
              cloneStyle={cloneStyle}>
              Badges
            </Widget>
          </div>
          <div className="p-[4px] h-[196px] w-full ">
            <Widget
              name={"square"}
              setActiveWidget={setActiveWidget}
              cloneStyle={cloneStyle}>
              Security
            </Widget>
          </div>
        </div>
        <div className="p-[4px] h-[196px] ">
          <Widget
            name={"rect"}
            setActiveWidget={setActiveWidget}
            cloneStyle={cloneStyle}>
            <div className="flex w-full justify-center items-center">Tasks</div>
            <div className="w-full"></div>
          </Widget>
        </div>

        <div className="flex ">
          <div className="p-[4px] h-[196px] w-full ">
            <Widget
              name={"circle"}
              setActiveWidget={setActiveWidget}
              cloneStyle={cloneStyle}
              type="round">
              GAS
            </Widget>
          </div>
          <div className="p-[4px] h-[196px] w-full ">
            <Widget
              name={"square"}
              setActiveWidget={setActiveWidget}
              cloneStyle={cloneStyle}>
              More
            </Widget>
          </div>
        </div>
      </div>
    </div>
  )
}

const OpenerElement = ({ state, setActiveWidget }: any) => {
  const [style, setStyle] = useState(state.style)

  useEffect(() => {
    if (style.top === "8px") return

    const transitionStyle = {
      ...state.style,
      background: "#d4d4d8",
      top: "8px",
      left: "8px",
      width: "calc(100% - 16px)",
      height: "calc(100% - 16px)",
      borderRadius: "8px"
    }

    setStyle(transitionStyle)
  }, [style])

  const onTransitionEnd = () => state.show === false && setActiveWidget("none")

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      style={state.show ? style : { ...state.style, background: "white" }}>
      {" "}
    </div>
  )
}

const Widget = ({
  children,
  name,
  setActiveWidget,
  cloneStyle,
  type = "square"
}: any) => {
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      className={`transition ${
        type === "round" ? "rounded-full" : "rounded-lg"
      } z-20 bg-white cursor-pointer hover:bg-zinc-100 flex items-center justify-center w-full h-full`}
      onClick={() => {
        cloneStyle(
          //@ts-ignore
          ref?.current?.getBoundingClientRect(),
          `${type === "round" ? "50%" : "8px"}`
        )

        setActiveWidget(name)
      }}>
      {children}
    </div>
  )
}
