import { useEffect, useRef, useState, type ElementType } from "react"
import { IoCloseOutline } from "react-icons/io5"

/**
 * A Simple Collapsible/Accardion.
 * HTML contents are available on the closed state.
 * Not suitable for usage in large quantity
 */
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
            : content.current
              ? content.current.scrollHeight
              : "auto"
        }}
        className="overflow-hidden transition-all duration-200">
        {parts.current.content}
      </div>
    </div>
  )
}

export const CollapsibleForTasks = ({ children, show, setShow }) => {
  const [animState, setAnimState] = useState(0)
  const current = {
    // toolbar: null,
    // toggle: null,
    // content: null
  }

  for (let i = 0; i < children.length; i++) {
    current[children[i].type.name] = children[i]
  }

  const parts = { current }
  ///

  useEffect(() => {
    if (show) setAnimState(1)
  }, [show])

  const content = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div className="h-full flex">
        <div>{parts.current["Action"] || ""}</div>
        <div
          onClick={() => (!show ? setShow(true) : setAnimState(0))}
          className="w-full">
          {parts.current["Toggle"]}
        </div>
      </div>
      <div
        style={{
          height:
            animState === 0
              ? "0rem"
              : content.current
                ? content.current.scrollHeight
                : // ? content.current.scrollHeight > 200
                  //   ? 200 + "px"
                  //   : content.current.scrollHeight
                  "auto"
        }}
        onTransitionEnd={() => animState == 0 && setShow(false)}
        className={`transition-[height] duration-200 text-xs w-full`}>
        {show && (
          <div ref={content}>
            <div className={`w-full transition-all`}>
              {parts.current["Content"]}
            </div>
            <div
              role="toolbar"
              aria-orientation="horizontal"
              className={`transition-all duration-200 flex gap-2 h-full items-center`}>
              {parts.current["Toolbar"]}
            </div>
          </div>
        )}
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
    //     const _parts = { toolbar: null, toggle: null, content: null }

    //     children.forEach((child) => {
    //       if (child.type.name === "Toolbar") _parts.toolbar = child
    //       if (child.type.name === "Toggle") _parts.toggle = child
    //       if (child.type.name === "Content") _parts.content = child
    //     })
    //     return _parts
    //   })()
    // )

    /// For Dev purposes use this, because useRef don't let styles affect on hot reloads
    /// REMOVE FOLLOWING ON PRODUCTION and use useRef instead
    const current = {
      toolbar: null,
      toggle: null,
      content: null
    }

    children.forEach((child) => {
      if (child.type.name === "Toolbar") current.toolbar = child
      if (child.type.name === "Toggle") current.toggle = child
      if (child.type.name === "Content") current.content = child
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
export const Action = ({ children }) => <>{children}</>
export const Content = ({ children }) => <>{children}</>
