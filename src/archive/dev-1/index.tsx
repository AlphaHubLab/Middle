import { Space_Grotesk } from "next/font/google"
import { Profiler, useState } from "react"

// import Apps from "~components/apps/apps"
import { ChatLikeEditor } from "~archive/chat-like-editor/chat-like-editor"
import Editable from "~archive/editable/editable"
import TaskForm from "~archive/form-editor/form"
import TodoMainSlash from "~components/editor/todo-main"
// import FormLikeEditor from "~components/form-like-editor/form-like-editor"
import ToodMain from "~archive/form-like-editor/todo-main"
import TaskboxSlate from "~archive/slate-editor.tsx/tastbox-slate"

const SG = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

export default function Page() {
  const [mode, setMode] = useState("form-like-slash")
  return (
    <div className={`h-screen ${SG.className}`}>
      <div className="rounded-lg p-1">
        <button
          className={`mx-1 rounded-lg py-1 px-2 ${mode === "form" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("form")}>
          Form
        </button>
        <button
          className={`mx-1 rounded-lg py-1 px-2 ${mode === "form-like" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("form-like")}>
          Form-like
        </button>
        <button
          className={`mx-1  rounded-lg py-1 px-2 ${mode === "wysisyg" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("wysisyg")}>
          WYSIWYG
        </button>
        <button
          className={`mx-1  rounded-lg py-1 px-2 ${mode === "chat-like" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("chat-like")}>
          Chat
        </button>
        <button
          className={`mx-1  rounded-lg py-1 px-2 ${mode === "content" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("content")}>
          Content
        </button>
        <button
          className={`mx-1  rounded-lg py-1 px-2 ${mode === "form-like-slash" ? "bg-zinc-300" : "hover:bg-zinc-100 bg-white"}`}
          onClick={() => setMode("form-like-slash")}>
          Form-like-slash
        </button>
      </div>
      <div className="flex w-full mt-2 justify-center">
        {mode === "wysisyg" && <TaskboxSlate />}
        {mode === "form-like" && <ToodMain />}
        {mode === "form-like-slash" && (
          <Profiler id="todo" onRender={onRender}>
            <TodoMainSlash />
          </Profiler>
        )}
        {mode === "form" && <TaskForm />}
        {mode === "chat-like" && <ChatLikeEditor />}
        {mode === "content" && <Editable />}
      </div>
      {/* <div className="basis-full md:basis-1/2 lg:basis-2/5">
        <Apps />
      </div> */}
    </div>
  )
}
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(id, "ad:", actualDuration, "bd:", baseDuration)
}
