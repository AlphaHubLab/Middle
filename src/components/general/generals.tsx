import type { IconType } from "react-icons"
import { PiCheckCircleBold, PiCheckFat, PiWarning } from "react-icons/pi"

import ButtonFull from "~components/ui/buttons/full-w-buttons"
import { Modal } from "~components/ui/modal"
import type { IModalProps } from "~components/ui/modal"

interface IPromptProps extends IModalProps {
  icon?: IconType
  acceptLabel: string
  onAccept: () => void
  cancelLabel: string
  onCancel: () => void
}

interface IAlertProps extends IModalProps {
  icon?: IconType
  doneLabel: string
  onDone: () => void
}

export const Success = (props: {
  text?: string
  buttonTitle?: string
  icon?: IconType
  onClick?: () => any
}) => {
  return (
    <div>
      <div className="relative h-24 flex items-center justify-center">
        <div className="h-full absolute modal-show text-emerald-500">
          <div className="flex items-center justify-center text-4xl w-full">
            {props.icon ? <props.icon /> : <PiCheckCircleBold />}
          </div>
          <p className="text-sm flex items-center justify-center text-black/90 text-emerald-500">
            {props.text ? props.text : "Successfull!"}
          </p>
        </div>
      </div>
      {props.onClick && (
        <ButtonFull onClick={props.onClick} variant="primary">
          {props.buttonTitle ? props.buttonTitle : "Great!"}
        </ButtonFull>
      )}
    </div>
  )
}

export const Alert = ({
  onDone,
  doneLabel,
  icon: Icon,
  ...props
}: IAlertProps) => {
  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex text-sm items-center gap-2 w-full">
          {Icon ? <Icon /> : <PiCheckFat />}
          <span className="text-fetch-primary">{props.title}</span>
        </h1>
      }>
      <div className="pt-2 pb-12 text-black/70 text-sm">{props.children}</div>
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <ButtonFull variant="primary" onClick={onDone}>
          {doneLabel}
        </ButtonFull>
      </div>
    </Modal>
  )
}

export const Prompt = ({
  acceptLabel,
  onAccept,
  cancelLabel,
  onCancel,
  icon: Icon,
  ...props
}: IPromptProps) => {
  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex font-semilbold text-sm items-center gap-2 w-full">
          {Icon ? <Icon /> : <PiWarning />}{" "}
          <span className="text-rose-500">{props.title}</span>
        </h1>
      }>
      {props.children}
      <div className="py-2 text-sm flex flex-col items-center *:my-1">
        <ButtonFull variant="primary" onClick={onCancel}>
          {cancelLabel}
        </ButtonFull>
        <ButtonFull variant="red" onClick={onAccept}>
          {acceptLabel}
        </ButtonFull>
      </div>
    </Modal>
  )
}
