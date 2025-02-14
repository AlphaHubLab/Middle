import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import { PiXCircleThin } from "react-icons/pi"

export interface IModalProps {
  children: ReactNode
  show: boolean
  onClose?: () => void
  className?: string
  title?: ReactNode
}

export const Modal = (props: IModalProps) => {
  if (!props.show) return false

  return (
    <>
      {createPortal(
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center z-30 p-2">
          <div
            // onClick={props.onClose && props.onClose}
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black/70 z-0"></div>
          <div
            className={`modal-show px-8 relative ${props.className && props.className}`}>
            <header className="flex w-full items-center h-12 border-b">
              {props.title ? <>{props.title}</> : <h1 className="text-fetch-primary w-full">Action needed</h1>}
              {props.onClose && (
                <div className="flex flex-auto items-center justify-end">
                  <button
                    onClick={props.onClose}
                    aria-label="Close modal"
                    className="cursor-pointer text-black/80 text-xl flex items-center justify-center hover:text-black/50 py-1 px-2">
                    <PiXCircleThin />
                  </button>
                </div>
              )}
            </header>
            <div className="pt-4 pb-6">{props.children}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
