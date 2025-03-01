import type { title } from "process"
import { useEffect, useState } from "react"
import { PiCheckFat, PiWarning } from "react-icons/pi"

import { Modal, type IModalProps } from "~components/ui/modal"
import ButtonFull from "~components/ui/buttons/full-w-buttons"
import { P, Section } from "~components/ui/typograrphy"
import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"

interface IPromptProps extends IModalProps {
  acceptLabel: string
  onAccept: () => void
  cancelLabel: string
  onCancel: () => void
}

interface IAlertProps extends IModalProps {
  doneLabel: string
  onDone: () => void
}

// const NO_PROMPT_PARAMS : IPromptProps = {
//   show: false,
//   onAccept: () => {},
//   acceptLabel: "",
//   onCancel: () => {},
//   title:""
//   onClose: ()
// }

export default function DangerZoneSetting() {
  const { drafts, setDrafts } = useDraft()
  const { tasks, setTasks, history, setHistory } = usePersist()

  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  const [showHistoryPrompt, setShowHistoryPrompt] = useState(false)
  const [showTasksPrompt, setShowTasksPrompt] = useState(false)
  const [actionDone, setActionDone] = useState(false)

  useEffect(() => {
    if (!showDraftPrompt && !showTasksPrompt && !showHistoryPrompt) return
    if (tasks.length === 0 || history.length === 0 || drafts.length === 0) {
      setShowDraftPrompt(false)
      setShowHistoryPrompt(false)
      setShowTasksPrompt(false)
      setActionDone(true)
    }
  }, [tasks, history, drafts])

  // const [promptParams, setPromptParams] = useState<IPromptProps>(NO_PƒROMPT_PARAMS)

  return (
    <Section title="Danger zone!">
      <>
        {actionDone && (
          <Alert
            onDone={() => setActionDone(false)}
            doneLabel="OK"
            title="Done"
            show={actionDone}>
            All done!
          </Alert>
        )}

        {showDraftPrompt && (
          <Prompt
            onAccept={() => setDrafts([])}
            acceptLabel="Delete Drafts"
            onCancel={() => setShowDraftPrompt(false)}
            cancelLabel="No!"
            title="Delete Drafts?"
            show={showDraftPrompt}
            onClose={() => setShowDraftPrompt(false)}>
            You are about to delete all of your drafted tasks and notes.
          </Prompt>
        )}
        {showHistoryPrompt && (
          <Prompt
            onAccept={() => setHistory([])}
            acceptLabel="Delete History"
            onCancel={() => setShowHistoryPrompt(false)}
            cancelLabel="No!"
            title="Delete History?"
            show={showHistoryPrompt}
            onClose={() => setShowHistoryPrompt(false)}>
            You are about to delete all of your completed.
          </Prompt>
        )}
        {showTasksPrompt && (
          <Prompt
            onAccept={() => setTasks([])}
            acceptLabel="Delete Tasks & Notes"
            onCancel={() => setShowTasksPrompt(false)}
            cancelLabel="No!"
            title="Delete Tasks?"
            show={showTasksPrompt}
            onClose={() => setShowTasksPrompt(false)}>
            You are about to delete all of your active tasks and notes.
          </Prompt>
        )}
      </>
      <div className="flex gap-2 items-center">
        <P>Delete all Drafts</P>
        <button
          className="text-xs text-rose-500 hover:text-rose-400 py-1 w-[150px] border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={() => setShowDraftPrompt(true)}>
          Delete Drafts
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <P>Delete all Completed tasks</P>
        <button
          className="text-xs text-rose-500 hover:text-rose-400 py-1 w-[150px] border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={() => setShowHistoryPrompt(true)}>
          Delete History
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <P>Delete all Active tasks and notes</P>
        <button
          className="text-xs text-rose-500 hover:text-rose-400 py-1 w-[150px] border rounded-xl h-8 border-rose-500 hover:bg-rose-100/50"
          onClick={() => setShowTasksPrompt(true)}>
          Delete Tasks
        </button>
      </div>
    </Section>
  )
}

const Alert = ({ onDone, doneLabel, ...props }: IAlertProps) => {
  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex text-sm items-center gap-2 w-full">
          <PiCheckFat />
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

const Prompt = ({
  acceptLabel,
  onAccept,
  cancelLabel,
  onCancel,
  ...props
}: IPromptProps) => {
  return (
    <Modal
      {...props}
      className="w-full max-w-[600px] rounded-3xl bg-white"
      title={
        <h1 className="flex text-sm items-center gap-2 w-full">
          <PiWarning /> <span className="text-rose-500">{props.title}</span>
        </h1>
      }>
      <div className="pt-2 pb-12 text-black/70 text-sm">{props.children}</div>
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
