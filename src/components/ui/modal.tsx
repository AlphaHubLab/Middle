import type { ReactNode } from "react"
import { createPortal } from "react-dom"

export interface IModalProps {
  children: ReactNode
  show: boolean
  onClose?: () => void
  className?: string
  title?: string
}

export const Modal = (props: IModalProps) => {
  if (!props.show) return false

  return (
    <>
      {createPortal(
        <div
          className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-black/70 z-30 p-2"
          onClick={props.onClose}>
          <div className={`modal-show px-8 relative ${props.className && props.className}`}>
            <header className="flex w-full items-center h-12 border-b">
              {props.title && <h1 className="flex-auto font-bold">{props.title}</h1>}
              {props.onClose && <div className="w-full flex justify-end pt-1 px-2">x</div>}
            </header>
            <div className="pt-4 pb-6">{props.children}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
