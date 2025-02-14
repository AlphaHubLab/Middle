import { useEffect, useState } from "react"

export default function Fade({ show, children, type }) {
  const [shouldRender, setRender] = useState(show)

  useEffect(() => {
    if (show) setRender(true)
  }, [show])

  const onTransitionEnd = () => {
    if (!show) setRender(false)
  }

  return (
    shouldRender && (
      <div
        className={`w-full h-full absolute top-0 ${show ? (type === "next" ? "fadeInToLeft" : "fadeInToRight") : type === "next" ? "fadeOutToLeft" : "fadeOutToRight"}`}
        onAnimationEnd={onTransitionEnd}>
        {children}
      </div>
    )
  )
}
