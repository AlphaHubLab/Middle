import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType
} from "react"
import { IoCloseOutline } from "react-icons/io5"

export const Collapsible = ({ children }) => {
  const [show, setShow] = useState(false)

  const content = useRef<HTMLDivElement>(null)

  //
  // use useRef for production
  //

  // const parts = useRef(
  //   (() => {
  //     const _parts = { toggle: null, content: null }

  //     children.forEach((child) => {
  //       if (child.type.name === "Toggle") _parts.toggle = child
  //       if (child.type.name === "Content") _parts.content = child
  //     })
  //     return _parts
  //   })()
  // )

  /// For Dev purposes use this, because useRef don't let styles affect on hot reloads
  /// REMOVE FOLLOWING ON PRODUCTION and use useRef instead
  const current = { toggle: null, content: null }

  children.forEach((child) => {
    if (child.type.name === "Toggle") current.toggle = child
    if (child.type.name === "Content") current.content = child
  })

  const parts = { current }
  ///

  return (
    <div className="overflow">
      <div onClick={() => setShow(!show)}>{parts.current.toggle}</div>
      <div
        ref={content}
        style={{
          maxHeight: !show
            ? `0px`
            : content
              ? content.current.scrollHeight
              : "auto"
        }}
        className="overflow-hidden transition-all duration-200">
        {parts.current.content}
      </div>
    </div>
  )
}

export const withCollapsibleAndToolbar = (Wrapper: ElementType) => {
  return ({ children, ...props }) => {
    const [show, setShow] = useState(false)
    const [animState, setAnimState] = useState(0)

    //
    // use useRef for production
    //

    // const parts = useRef(
    //   (() => {
    //     const _parts = { toolbar: null, toggle: null, content: null, permanent: null }

    //     children.forEach((child) => {
    //       if (child.type.name === "Toolbar") _parts.toolbar = child
    //       if (child.type.name === "Toggle") _parts.toggle = child
    //       if (child.type.name === "Content") _parts.content = child
    //       if (child.type.name === "Permanent") current.permanent = child
    //     })
    //     return _parts
    //   })()
    // )

    /// For Dev purposes use this, because useRef don't let styles affect on hot reloads
    /// REMOVE FOLLOWING ON PRODUCTION and use useRef instead
    const current = {
      toolbar: null,
      toggle: null,
      content: null,
      permanent: null
    }

    children.forEach((child) => {
      if (child.type.name === "Toolbar") current.toolbar = child
      if (child.type.name === "Toggle") current.toggle = child
      if (child.type.name === "Content") current.content = child
      if (child.type.name === "Permanent") current.permanent = child
    })
    const parts = { current }
    ///

    useEffect(() => {
      if (show) setAnimState(1)
    }, [show])

    const content = useRef<HTMLDivElement>(null)
    return (
      <div>
        {show && (
          <div
            role="toolbar"
            aria-orientation="horizontal"
            onTransitionEnd={() => animState == 0 && setShow(false)}
            style={{ height: `${animState * 20}px`, opacity: animState }}
            className="transition-all duration-200 flex gap-2">
            <button
              className="hover:text-zinc-500 text-sm px-2"
              onClick={() => setAnimState(0)}>
              <IoCloseOutline />
            </button>
            {parts.current.toolbar}
          </div>
        )}

        <Wrapper {...props}>
          <div
            onClick={() => setShow(true)}
            style={{
              height:
                animState === 0
                  ? "2.5rem"
                  : content.current
                    ? content.current.scrollHeight + "px"
                    : "auto"
            }}
            className={`transition-[height] duration-200 oveflow-y-hidden text-xs w-full ${animState === 0 && "cursor-pointer"}`}>
            {!show && <div className="h-full">{parts.current.toggle}</div>}
            {show && (
              <div
                ref={content}
                style={{
                  opacity: animState * 1
                }}
                className={`w-full transition-all ${animState === 1 ? "duration-500" : "duration-100"}`}>
                {parts.current.content}
              </div>
            )}
          </div>
        </Wrapper>
      </div>
    )
  }
}

export const Toolbar = ({ children }) => <>{children}</>
export const Toggle = ({ children }) => <>{children}</>
export const Content = ({ children }) => <>{children}</>
export const Permanent = ({ children }) => <>{children}</>
