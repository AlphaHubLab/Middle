import { useState } from "react"

import {
  Checkbox,
  CollapsibleForTasks,
  Content,
  Toggle,
  Toolbar
} from "~components/ui/collapsible"

export default function Page() {
  const [show, setShow] = useState(false)
  const [timerStyle, setTimerStyle] = useState({
    width: "0%",
    transitionDuration: "1.5s"
  })

  const handleCheck = (e) => {
    if (!e.target.checked) {
      setTimerStyle({ width: "0%", transitionDuration: "0.3s" })
    } else {
      setTimerStyle({ width: "100%", transitionDuration: "1.5s" })
    }
  }
  return (
    <div className="p-20">
      <UpcommingItemWrapper>
        <CollapsibleForTasks show={show} setShow={setShow}>
          <Checkbox>
            <div
              className={`flex w-8 h-full justify-center items-center bg-zinc-100 ${show && "border-b-[1px]"}`}>
              <input type="checkbox" onChange={handleCheck} />
            </div>
          </Checkbox>
          <Toggle>
            <div
              className={`h-10 relative bg-zinc-100 hover:cursor-pointer select-none ${show && "border-b-[1px]"}`}>
              <div
                onTransitionEnd={() =>
                  timerStyle.width === "100%" && console.log("done")
                }
                style={timerStyle}
                className="z-0 transition-[width] left-0 top-0 ease-in absolute h-full bg-emerald-200 "></div>
              <div className="relative z-1 flex w-full items-center">click</div>
            </div>
          </Toggle>
          <Content>
            <div className="flex">
              <div className="w-8"></div>
              <div className="overflow-y-auto styled-scrollbar h-content max-h-[176px] w-full">
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>content</div>
                <div>contents</div>
              </div>
            </div>
          </Content>
          <Toolbar>
            <div className="bg-zinc-200 w-full border-t-[1px] h-[24px]">
              asdf
            </div>
          </Toolbar>
        </CollapsibleForTasks>
      </UpcommingItemWrapper>
    </div>
    // </div>
  )
}

const UpcommingItemWrapper = ({ children }) => {
  return (
    <div
      className={`border-[1px] hover:shadow-md rounded-md flex flex-col justify-center overflow-hidden`}>
      <div className="h-full w-full flex w-full">
        <div className=" w-full h-full">
          <div className=" w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
